import mongoose, { Schema, Document } from 'mongoose';



const TransactionSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name : { type : String, default: null},
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    amount: { type: Number, required: true },
    wallet: { type: Number },
    paymentMethod: { type: String, enum: ['upi', 'bank'], required: true },
    details: { 
        type: mongoose.Schema.Types.Mixed, // Allows storing any data type, including objects
        required: true 
      },

    filename: { type: String, default: null},
    path: { type: String, default: null},
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    date: { type: Date, default: Date.now },
    paymentReference: { type: String, required: true }, 
});

// Export the model
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
