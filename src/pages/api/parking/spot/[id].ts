// pages/api/parkingArea/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import ParkingSpot from "@root/models/ParkingSpot";
import { connectToDatabase } from "@root/lib/mongodb";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    await connectToDatabase();
    const parkingSpot = await ParkingSpot.findById(id);

    if (!parkingSpot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    return res.status(200).json(parkingSpot);
  } catch (error) {
    console.error("Error retrieving parking spot:", error);
    return res.status(500).json({ message: "An error occurred while retrieving the parking spot" });
  }
}

// Allow roles: user, admin, LandOwner
export default withRoleGuard(handler, ["user", "admin", "LandOwner"]);
