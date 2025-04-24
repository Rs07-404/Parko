// API that will take reservation id from body and call cancelResrvation function by passing that reservation id. Everything must be in try catch block
import cancelReservation from "@root/lib/actions/cancelReservation"
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const {reservationId} = req.body;

        if (!reservationId) {
            return res.status(400).json({ error: "Reservation ID is required" })
        }

        const result = await cancelReservation(reservationId)

        return res.status(200).json({ message: "Reservation canceled successfully"})

    } catch (error) {
        console.error("Error canceling reservation:", error)
        return res.status(500).json({ error: "Failed to cancel reservation" })
    }
}
