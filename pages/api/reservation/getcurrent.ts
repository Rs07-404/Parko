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
        const userId = (req as GaurdedRequest).user._id;
        const currentReservationId = (req as GaurdedRequest).user.currentReservation // Added by withRoleGuard middleware

        await connectToDatabase();

        if (!currentReservationId) {
            return res.status(404).json({ message: "No Reservations Found" })
        }

        const currentReservation = await Reservation.findById({currentReservationId});

        //TODO: currentTime undefined.....

        if (!currentReservation) {
            return res.status(404).json({ message: "No Reservations Found" })
        }

        return res.status(200).json({
            message: "Reservation found successfully.",
            reservation: currentReservation,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in getCurrentReservation:", error.message);
            return res.status(500).json({ error: "Internal server error." });
        } else {
            console.error("Unknown error in getCurrentReservation");
            return res.status(500).json({ error: "Internal server error." });
        }
    }
}

export default withRoleGuard(handler, ["User", "Admin", "EntryOperator", "ExitOperator"]);
