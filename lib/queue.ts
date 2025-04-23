// lib/queues.ts
import { Queue } from 'bullmq';
import { redisConnection } from '../config/constants';

export const reservationQueue = new Queue('reservationQueue', {
  connection: redisConnection,
});
