// pages/api/parkingArea/withSpots/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import ParkingArea from "@root/models/ParkingArea";
import { connectToDatabase } from "@root/lib/mongodb";

/**
 * @description Fetches a specific parking area by its ID with its associated parking spots populated.
 * @route GET /api/parkingArea/withSpots/[id]
 * @access user, admin, LandOwner
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id } = req.query;

    try {
        await connectToDatabase();

        // Find the parking area by ID and populate the parkingSpots field
        const parkingArea = await ParkingArea.findById(id).populate({
            path: "parkingSpots",
            model: "ParkingSpot",
        });

        if (!parkingArea) {
            return res.status(404).json({ error: "Parking Area not found" });
        }

        return res.status(200).json(parkingArea);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error retrieving Parking Area: ${error.message}`);
            return res.status(500).json({ message: `Error retrieving Parking Area: ${error.message}` });
        } else {
            console.error(`Error retrieving Parking Area: ${error}`);
            return res.status(500).json({ message: `Error retrieving Parking Area` });
        }
    }
}

// Apply role guard: user, admin, LandOwner
export default withRoleGuard(handler, ["user", "admin", "LandOwner"]);
