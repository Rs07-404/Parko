// pages/api/parkingArea/removeSpot.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingArea from "@root/models/ParkingArea";
import { IParkingSpot } from "@root/models/ParkingSpot";

/**
 * @description Remove a ParkingSpot from a ParkingArea.
 * @route POST /api/parkingArea/removeSpot
 * @access admin, LandOwner
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { parkingAreaId, parkingSpotId } = req.body;

    await connectToDatabase();

    const parkingArea = await ParkingArea.findById(parkingAreaId);
    if (!parkingArea) return res.status(404).json({ error: "Parking Area not found" });

    parkingArea.parkingSpots = parkingArea.parkingSpots.filter(
      (spot: IParkingSpot) => spot.toString() !== parkingSpotId
    );

    const updatedParkingArea = await parkingArea.save();

    return res.status(200).json({ message: "Parking Spot Removed Successfully", updatedParkingArea });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error removing Parking Spot: ${error.message}`);
      return res.status(500).json({ message: `Error removing Parking Spot: ${error.message}` });
    } else {
      console.error(`Error removing Parking Spot: ${error}`);
      return res.status(500).json({ message: `Error removing Parking Spot` });
    }
  }
}

export default withRoleGuard(handler, ["admin"]);
