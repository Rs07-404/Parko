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
        await connectToDatabase();

        // Get current time and calculate time 10 minutes ago
        const currentTime = new Date();
        const tenMinutesAgo = new Date(currentTime.getTime() - 7 * 60 * 1000);

        // Find all reservations that are Booked and have booking time more than 10 minutes ago
        const reservationsToCancel = await Reservation.find({
            status: 'Booked',
            bookingTime: { $lte: tenMinutesAgo }
        });

        if (reservationsToCancel.length === 0) {
            return res.status(200).json({ message: "No reservations to cancel" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            for (const reservation of reservationsToCancel) {
                const user = await User.findById(reservation.userId);
                const subscription = await PushSubscription.findOne({ userId: user?._id });

                // Update reservation status
                reservation.status = 'Canceled';
                await reservation.save({ session });

                // Update user's current reservation if it matches
                if (user && user.currentReservation?.toString() === reservation._id.toString()) {
                    user.currentReservation = null;
                    await user.save({ session });
                }

                // Update parking spots status
                await ParkingSpot.updateMany(
                    { _id: { $in: reservation.parkingSpots } },
                    { $set: { status: 'available' } },
                    { session }
                );

                // Send push notification if user has subscription
                if (subscription) {
                    await sendPushNotification({
                        userId: user._id,
                        title: 'Reservation Cancelled',
                        body: 'Your reservation has been cancelled due to no entry within 10 minutes of booking time',
                    });
                }

                console.log(`Reservation ${reservation._id} cancelled due to no entry within 10 minutes`);
            }

            await session.commitTransaction();
            return res.status(200).json({ 
                message: "Reservations cancelled successfully", 
                count: reservationsToCancel.length 
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error("Error canceling reservations:", error);
        return res.status(500).json({ error: "Failed to cancel reservations" });
    }
}
