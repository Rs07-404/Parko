// worker/reservationWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '@root/config/constants';
import Reservation from '@root/models/Reservation';
import { connectToDatabase } from '@root/lib/mongodb';
import User from '@root/models/User'
import PushSubscription from '@root/models/PushSubscription';
import mongoose from 'mongoose';
import { sendPushNotification } from '@root/utils/pushNotification';

(async () => {
  // Connect to MongoDB
  await connectToDatabase();

  // Create Worker
  new Worker('reservationQueue', async (job) => {
    const { reservationId } = job.data;

    const reservation = await Reservation.findById(reservationId);
    const user = await User.findById(reservation?.userId);
    const subscription = await PushSubscription.findOne({ userId: user?._id });
    if (reservation && reservation.status === 'booked') {
      reservation.status = 'cancelled';
      user.currentReservation = null;
      // setup transaction to update reservation and user at same time
      const session = await mongoose.startSession();
      session.startTransaction();
      await reservation.save({ session });
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
    } else {
      console.log(`Reservation ${reservationId} already handled`);
    }
  }, {
    connection: redisConnection,
  });
})();
