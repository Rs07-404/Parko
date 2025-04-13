// pages/api/reservations/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingSpot from "@root/models/ParkingSpot";
import Reservation from "@root/models/Reservation";
import User from "@root/models/User";
import { GaurdedRequest } from "@root/lib/interfaces/IRequest";

/**
 * @description Creates a reservation for a parking spot.
 * @route POST /api/reservations/create
 * @access user
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { parkingAreaId, parkingSpotId, startTime, endTime } = req.body;
    const userId = (req as GaurdedRequest).user._id; // Added by withRoleGuard middleware

    await connectToDatabase();

    const parkingSpot = await ParkingSpot.findById(parkingSpotId);
    if (!parkingSpot) {
      return res.status(404).json({ error: "Parking spot not found." });
    }

    if (parkingSpot.status === "occupied") {
      return res.status(400).json({ error: "Parking spot is currently occupied." });
    }

    const overlappingReservation = await Reservation.findOne({
      userId,
      parkingAreaId,
      parkingSpotId,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
    });

    if (overlappingReservation) {
      return res.status(400).json({ error: "Conflicting reservation exists for the selected time range." });
    }

    const reservation = new Reservation({
      userId,
      parkingAreaId,
      parkingSpotId,
      startTime,
      endTime,
      status: "confirmed",
    });

    const user = await User.findById(userId);
    if (user) {
      user.reservations.push(reservation._id);
      await user.save();
    }

    await reservation.save();

    if (!parkingSpot.areaId) {
      parkingSpot.areaId = parkingAreaId;
    }
    parkingSpot.status = "occupied";
    await parkingSpot.save();

    const timeUntilAvailable = new Date(endTime).getTime() - Date.now();
    if (timeUntilAvailable > 0) {
      setTimeout(async () => {
        const spot = await ParkingSpot.findById(parkingSpotId);
        if (spot?.status === "occupied") {
          spot.status = "available";
          await spot.save();
        }
      }, timeUntilAvailable);
    }


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
