// pages/api/parkingArea/[id]/delete.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import ParkingArea from "@root/models/ParkingArea";

/**
 * @description Delete a ParkingArea by ID.
 * @route DELETE /api/parkingArea/[id]/delete
 * @access admin, LandOwner
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    await connectToDatabase();

    const deletedParkingArea = await ParkingArea.findByIdAndDelete(id);
    if (!deletedParkingArea) {
      return res.status(404).json({ error: "Parking Area not found" });
    }

    return res.status(200).json({ message: "Parking Area Deleted Successfully", deletedParkingArea });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error deleting Parking Area: ${error.message}`);
      return res.status(500).json({ message: `Error deleting Parking Area: ${error.message}` });
    } else {
      console.error(`Error deleting Parking Area: ${error}`);
      return res.status(500).json({ message: `Error deleting Parking Area` });
    }
  }
}

export default withRoleGuard(handler, ["admin", "LandOwner"]);
