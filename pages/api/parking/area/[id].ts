// pages/api/parkingArea/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingArea from "@root/models/ParkingArea";

/**
 * @description Update a specific parking area by ID.
 * @route PUT /api/parkingArea/[id]
 * @access admin, LandOwner
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    await connectToDatabase();

    const updatedParkingArea = await ParkingArea.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedParkingArea) {
      return res.status(404).json({ error: "Parking Area not found" });
    }

    return res.status(200).json({
      message: "Parking Area Updated Successfully",
      updatedParkingArea,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating Parking Area: ${error.message}`);
      return res.status(500).json({ message: `Error updating Parking Area: ${error.message}` });
    } else {
      console.error(`Error updating Parking Area: ${error}`);
      return res.status(500).json({ message: `Error updating Parking Area` });
    }
  }
}

export default withRoleGuard(handler, ["admin", "LandOwner"]);
