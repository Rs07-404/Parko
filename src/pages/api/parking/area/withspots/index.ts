// pages/api/parkingArea/withSpots/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import ParkingArea from "@root/models/ParkingArea";
import { connectToDatabase } from "@root/lib/mongodb";
// import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";

/**
 * @description Fetches all parking areas with their associated parking spots populated.
 * @route GET /api/parkingArea/withSpots
 * @access user, admin, LandOwner
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    // Fetch all parking areas and populate the referenced parking spots
    const parkingAreas = await ParkingArea.find().populate({
      path: "parkingSpots",
      model: "ParkingSpot",
    });

    return res.status(200).json(parkingAreas);
  } catch (error) {
    if(error instanceof Error){
        console.error(`Error retrieving all Parking Areas: ${error.message}`);
        return res.status(500).json({ message: `Error retrieving all Parking Areas: ${error.message}` });
    } else{
        console.error(`Error retrieving all Parking Areas: ${error}`);
        return res.status(500).json({ message: `Error retrieving all Parking Areas` });
    }
  }
}

// Apply role guard: user, admin, LandOwner
export default handler;
