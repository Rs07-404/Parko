// worker/reservationWorker.ts
import { Worker } from 'bullmq';
import { redisConnection } from '@root/config/constants';
import Reservation from '@root/models/Reservation';
import { connectToDatabase } from '@root/lib/mongodb';
import User from '@root/models/User'
import PushSubscription from '@root/models/PushSubscription';
import mongoose from 'mongoose';
import { sendPushNotification } from '@root/utils/pushNotification';
import ParkingSpot from '@root/models/ParkingSpot';
import cancelReservation from '@root/lib/actions/cancelReservation';

(async () => {
  

  // Create Worker
  new Worker('reservationQueue', async (job) => {
    const { reservationId } = job.data;
    cancelReservation(reservationId);
    
  }, {
    connection: redisConnection,
  });
})();
