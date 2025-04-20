// pages/api/save-subscription.ts
import PushSubscription from '@root/models/PushSubscription';
import { connectToDatabase } from '@root/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    try {
        await connectToDatabase();
        const { subscription, userId } = req.body;

    await PushSubscription.findOneAndUpdate(
        { userId },
        { ...subscription, userId },
        { upsert: true, new: true }
    );

        res.status(200).json({ message: 'Subscription saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
