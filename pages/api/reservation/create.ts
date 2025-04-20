// pages/api/reservations/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingSpot from "@root/models/ParkingSpot";
import Reservation from "@root/models/Reservation";
import User from "@root/models/User";
import { GaurdedRequest } from "@root/lib/interfaces/IRequest";
import { reservationQueue } from "@root/lib/queue";
import { sendPushNotification } from "@root/utils/pushNotification";

/**
 * @description Creates a reservation for multiple parking spots.
 * @route POST /api/reservations/create
 * @access user
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { parkingAreaId, parkingSpots } = req.body; // Changed to parkingSpots (array)
    const sessionUser = (req as GaurdedRequest).user; // Added by withRoleGuard middleware
    const userId = sessionUser._id;
    if (sessionUser.currentReservation) {
      return res.status(200).json({
        success: true,
        hasReservation: false,
        message: "Cannot book when an ongoing reservation exists"
      });
    }

    await connectToDatabase();

    // Fetch parking spots that are available (status: "available") and are in the parkingSpots array
    const availableSpots = await ParkingSpot.find({
      '_id': { $in: parkingSpots },
      'status': 'available'
    });

    // If the number of available spots is less than the requested spots, there are unavailable spots
    if (availableSpots.length !== parkingSpots.length) {
      return res.status(400).json({
        message: "Some of the selected parking spots are unavailable."
      });
    }

    // Check for overlapping reservations for each of the selected parking spots

    // Create a new reservation for multiple parking spots
    const reservation = new Reservation({
      userId,
      parkingAreaId,
      parkingSpots, // Store the array of parking spots
      bookingTime: new Date(),
      status: "confirmed",
    });

    const user = await User.findById(userId);
    if (user) {
      user.reservations.push(reservation._id);
      user.currentReservation = reservation._id;
      await user.save();
    }

    await reservation.save();

    // Update parking spots' status to "occupied"
    await ParkingSpot.updateMany(
      { '_id': { $in: parkingSpots } },
      { $set: { status: 'occupied', areaId: parkingAreaId } }
    );

    // Optionally handle status reset after reservation ends
    await reservationQueue.add(
      'autoCancelReservation',
      { reservationId: reservation._id.toString() },
      { delay: 30 * 60 * 1000 } // 30 mins in ms
    );

    await sendPushNotification({
      userId: userId,
      title: 'Reservation Created',
      body: 'Your reservation has been created successfully.',
    });

    return res.status(201).json({
      message: "Reservation created successfully.",
      reservation,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createReservation:", error.message);
      return res.status(500).json({ error: "Internal server error." });
    } else {
      console.error("Unknown error in createReservation");
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default withRoleGuard(handler, ["User"]);
