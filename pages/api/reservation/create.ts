// pages/api/reservations/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingSpot from "@root/models/ParkingSpot";
import Reservation from "@root/models/Reservation";
import User from "@root/models/User";
import { GaurdedRequest } from "@root/lib/interfaces/IRequest";
import { sendPushNotification } from "@root/utils/pushNotification";
import { generateQRCode } from "@root/utils/qrcodeworks";
import Ticket from "@root/models/Ticket";
import mongoose from "mongoose";
import cancelReservation from "@root/lib/actions/cancelReservation";
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
      status: "Booked",
    });
    
    const svgQrcode = await generateQRCode({
      reservationid: reservation._id.toString(),
      parkingAreaId: parkingAreaId.toString(),
      bookingTime: reservation.bookingTime.toISOString(),
      userId: userId.toString(),
    });

    if(!svgQrcode){
      return res.status(500).json({ error: "Error generating Ticket" });
    }

    const newTicket = new Ticket({
      qrcode: svgQrcode,
    });

    if(!newTicket){
      return res.status(500).json({ error: "Error generating Ticket" });
    }

    await newTicket.save();

    reservation.ticketKey = newTicket._id;

    const user = await User.findById(userId);
    if (user) {
      user.reservations.push(reservation._id);
      user.currentReservation = reservation._id;
      
    }

    // Transaction to save reservation and update parking spots' status
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await user.save({session});
      await reservation.save({ session });
      await ParkingSpot.updateMany(
        { '_id': { $in: parkingSpots } },
        { $set: { status: 'occupied', areaId: parkingAreaId } },
        { session }
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new Error(error as string);
    } finally {
      session.endSession();
    }

    // Cancel after half hour
    setTimeout(()=>{cancelReservation(reservation._id)}, 10 * 60 * 1000) // 10 mins in ms

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
      console.error("Unknown error in createReservation", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default withRoleGuard(handler, ["User"]);
