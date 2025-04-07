// pages/api/parkingArea/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import ParkingSpot from "@root/models/ParkingSpot";
import { connectToDatabase } from "@root/lib/mongodb";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    const parkingSpots = await ParkingSpot.find();
    return res.status(200).json(parkingSpots);
  } catch (error) {
    console.error("Error fetching parking spots:", error);
    return res.status(500).json({ message: "Failed to fetch parking spots" });
  }
}

// Allow roles: user, admin, LandOwner
export default withRoleGuard(handler, ["user", "admin", "LandOwner"]);
