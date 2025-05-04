// utils/push.ts
import webpush from 'web-push';
import { connectToDatabase } from '@root/lib/mongodb';
import PushSubscription from '@root/models/PushSubscription';
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '@root/config/constants';

webpush.setVapidDetails(
  'mailto:your@email.com',
  VAPID_PUBLIC_KEY!,
  VAPID_PRIVATE_KEY!
);

async function getSubscriptionsByUserId(userId: string) {
  return await PushSubscription.find({ userId });
}

export async function sendPushNotification({ userId, title, body }: { userId: string, title: string, body: string }) {
  // Get all user's subscriptions from DB
  await connectToDatabase();
  const subscriptions = await getSubscriptionsByUserId(userId);
  if (!subscriptions || subscriptions.length === 0) return;

  const payload = JSON.stringify({ title, body, url: 'https://parko-orpin.vercel.app/reservations' });

  // Send notifications to all devices in parallel
  const notificationPromises = subscriptions.map(subscription => 
    webpush.sendNotification(subscription, payload)
      .catch(err => {
        console.error(`Push failed for subscription ${subscription._id}:`, err);
        // If the subscription is no longer valid, remove it from the database
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Subscription ${subscription._id} is no longer valid. Removing from database.`);
          return PushSubscription.findByIdAndDelete(subscription._id);
        }
        return null;
      })
  );

  try {
    await Promise.all(notificationPromises);
  } catch (err) {
    console.error('Error sending notifications:', err);
  }
}
