import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

const PushSubscription = mongoose.models.PushSubscription || mongoose.model('PushSubscription', pushSubscriptionSchema);

export default PushSubscription;