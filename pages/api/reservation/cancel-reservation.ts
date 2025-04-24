import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import ParkingSpot from "@root/models/ParkingSpot";
import Reservation from "@root/models/Reservation";
import User from "@root/models/User";
import { sendPushNotification } from "@root/utils/pushNotification";
import mongoose from "mongoose";
import { connectToDatabase } from "@root/lib/mongodb";
import PushSubscription from "@root/models/PushSubscription";
export async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const {reservationId} = req.body;
        await connectToDatabase();

        const reservation = await Reservation.findById(reservationId);
        const user = await User.findById(reservation?.userId);
        const subscription = await PushSubscription.findOne({ userId: user?._id });
        if (reservation && reservation.status === 'Booked') {
          reservation.status = 'Canceled';
          user.currentReservation = null;
          // setup transaction to update reservation and user at same time
          const session = await mongoose.startSession();
          session.startTransaction();
          await reservation.save({ session });
          await ParkingSpot.updateMany({ _id: { $in: reservation.parkingSpots } }, { $set: { status: 'available' } }, { session });
          await user.save({ session });
          await session.commitTransaction();
    
          if (subscription) {
            await sendPushNotification({
              userId: user._id,
              title: 'Reservation Cancelled',
              body: 'Your reservation has been cancelled due to no entry',
            });
          }
    
          console.log(`Reservation ${reservationId} cancelled due to no entry`);
          return { message: "Reservation canceled successfully", data: reservation }
        } else {
          console.log(`Reservation ${reservationId} already handled`);
          return { message: "Reservation already handled" }
        }

    } catch (error) {
        console.error("Error canceling reservation:", error)
        return res.status(500).json({ error: "Failed to cancel reservation" })
    }
}
