// pages/api/reservations/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import Reservation from "@root/models/Reservation";
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
        const { currentTime } = req.body;
        const userId = (req as GaurdedRequest).user._id; // Added by withRoleGuard middleware

        await connectToDatabase();

        const currentReservation = await Reservation.findOne({
            userId,
            startTime: { $lte: currentTime },
            endTime: { $gte: currentTime },
        });

        //TODO: currentTime undefined..... 

        if (!currentReservation) {
            return res.status(404).json({ message: "No Reservations Found" })
        }

        return res.status(201).json({
            message: "Reservation created successfully.",
            reservation: currentReservation,
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
