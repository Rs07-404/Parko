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
    // Call the API to cancel the reservation
    try {
      const response = await fetch('http://parko-orpin.vercel.app/api/reservation/cancel-reservation', {
        method: 'POST',
        body: JSON.stringify({ reservationId }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
    
  }, {
    connection: redisConnection,
  });
})();
