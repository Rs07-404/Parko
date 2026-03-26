// pages/api/parkingArea/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import ParkingArea from "@root/models/ParkingArea";
import { connectToDatabase } from "@root/lib/mongodb";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { name, location, boundary, area, parkingSpots, columns } = req.body;

    const parkingArea = new ParkingArea({
      name,
      location,
      boundary,
      area,
      parkingSpots: parkingSpots || [],
      columns: columns ?? 0
    });

    const result = await parkingArea.save();

    return res.status(201).json(result);
  } catch (error) {
    if(error instanceof Error){
        console.log(`Error creating Parking Area: ${error.message}`);
        return res.status(500).json({ message: `Error creating Parking Area: ${error.message}` });
    } else {
        console.log(`Error creating Parking Area: ${error}`);
        return res.status(500).json({message: `Unexpected Error Occured`})
    }
  }
}

// Only admins and landowners can create parking areas
export default withRoleGuard(handler, ["admin", "LandOwner"]);
