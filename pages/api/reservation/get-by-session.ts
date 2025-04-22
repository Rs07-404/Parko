// get all reservations by user id

import { NextApiRequest, NextApiResponse } from "next";
import { GaurdedRequest } from "@root/lib/interfaces/IRequest";
import { connectToDatabase } from "@root/lib/mongodb";
import Reservation from "@root/models/Reservation";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const user = (req as GaurdedRequest).user;

        await connectToDatabase();

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const reservations = await Reservation.find({ userId: user._id })
        .populate('parkingAreaId', 'name address')
        .populate('ticketKey');

        return res.status(200).json({
            message: "Reservations fetched successfully.",
            reservations: reservations,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default withRoleGuard(handler, ['User']);
