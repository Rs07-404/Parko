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

async function getSubscriptionByUserId(userId: string) {
  return await PushSubscription.findOne({ userId });
}

export async function sendPushNotification({ userId, title, body }: { userId: string, title: string, body: string }) {
  // Get user's subscription from DB
  await connectToDatabase();
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) return;

  const payload = JSON.stringify({ title, body, url: '/reservations' });

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.error('Push failed:', err);
  }
}
