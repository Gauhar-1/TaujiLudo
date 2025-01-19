import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    userId: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    paymentMethod: 'upi' | 'bank';
    details: string | Object; // UPI ID or Bank Details
    status: 'pending' | 'completed' | 'failed';
    date: Date;
    paymentReference: string; 
}

const TransactionSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'bank'], required: true },
    details: { 
        type: mongoose.Schema.Types.Mixed, // Allows storing any data type, including objects
        required: true 
      },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    date: { type: Date, default: Date.now },
    paymentReference: { type: String, required: true }, 
});

// Export the model
const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;
