import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
    userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss';
  message: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' ;
  reason: ""
  createdAt: Date;
  paymentReference: string; 
  markAsRead : boolean;
}

const notificationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdrawal', 'bet', 'win', 'loss'], required: true },
  amount: { type: Number, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed' ,"pending"] },
  createdAt: { type: Date, default: Date.now },
  paymentReference: { type: String, required: true }, 
  reason: { type: String, default: null }, 
  markAsRead: { type: Boolean, default: null }, 
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
