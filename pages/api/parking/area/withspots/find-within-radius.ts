// pages/api/parkingArea/findWithinRadius.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingArea from "@root/models/ParkingArea";

/**
 * @description Find parking areas within a radius (in kilometers) from provided coordinates.
 * @route POST /api/parkingArea/findWithinRadius
 * @access admin, LandOwner
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { coordinates, radius } = req.body;

    await connectToDatabase();

    const parkingAreas = await ParkingArea.find({
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [coordinates, radius / 6378.1], // Earth radius in km
        },
      },
    }).populate({
      path: "parkingSpots",
      model: "ParkingSpot",
    });

    return res.status(200).json(parkingAreas);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error finding Parking Areas: ${error.message}`);
      return res.status(500).json({ message: `Error finding Parking Areas: ${error.message}` });
    } else {
      console.error(`Error finding Parking Areas: ${error}`);
      return res.status(500).json({ message: `Error finding Parking Areas` });
    }
  }
}

export default withRoleGuard(handler, ["admin", "LandOwner"]);
