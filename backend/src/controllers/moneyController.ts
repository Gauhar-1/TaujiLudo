import Transaction from "../models/Transaction";
import { Notification } from "../models/Trans-notification";
import crypto from 'crypto';
import { randomBytes } from "crypto";
import { createNotification } from "./notifyController";
import mongoose from "mongoose";

export const depositAmount = async (req : any,res : any,next: any) => {
    const { userId, amount, paymentMethod, upiId } = req.body;
    
    if (!req.body.userId || !mongoose.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
      }
      

    try {
        // Generate a unique payment reference (e.g., transaction ID or QR code)
        const paymentReference = crypto.randomBytes(8).toString('hex');

        // Save transaction in the database
        const transaction = await Transaction.create({
            userId,
            type: 'deposit',
            amount,
            paymentMethod,
            paymentReference,
            status: 'pending',
            details:upiId
        })

        await createNotification(
            userId, 
            'deposit', 
            `Your deposit of ${amount} tokens was successful.`,
             paymentReference,
             'pending',
             amount
        );

         // Simulate UPI link (replace with QR code generation in production)
         const upiLink = `upi://pay?pa=${upiId}&pn=BettingGateway&am=${amount}&tn=${paymentReference}`;

         res.status(200).json({
             success: true,
             message: 'Deposit initiated. Complete the payment.',
             upiLink,
             transaction,
         });
     } catch (err : any) {
         console.error(err);
         res.status(500).json({ success: false, message: 'Deposit failed', error: err.message });
     }
 };

 export const withdrawAmount = async (req: any, res: any) => {
    const { userId, amount, paymentMethod, destinationDetails} = req.body;

    if (!req.body.userId || !mongoose.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
      }
      

    try {
        // Fetch user's balance (mocked here; implement in your User model)
        const userBalance = 100000; // Replace with actual wallet balance from the database

        const paymentReference = crypto.randomBytes(8).toString('hex')

        if (userBalance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
        }

        // Deduct tokens and log the withdrawal request
        const transaction = await Transaction.create({
            userId,
            type: 'withdraw',
            amount,
            paymentMethod,
            paymentReference, 
            status: 'pending',
            details: destinationDetails
        });

        if(!transaction){
            console.log("Failed to create withdraw");
        }

        await createNotification(
            userId, 
            'withdrawal', 
            `Your whithdrwal of ${amount} tokens was successful.`,
             paymentReference,
             'pending',
             amount
        );
        console.log("notification is passed");

        res.status(200).json({
            success: true,
            message: 'Withdrawal request submitted. It will be processed manually.',
            transaction,
        });
    } catch (err : any) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Withdrawal failed', error: err.message });
    }
}

export const  verifyPayment = async (req: any ,res : any) => {
    const { paymentReference, transactionId } = req.body;

    try {
        // Find the transaction by payment reference
        const transaction = await Transaction.findOne({ paymentReference, status: 'pending' });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        // Update the transaction as completed
        transaction.status = 'completed';
        await transaction.save();

        // Add tokens to the user's wallet (mocked here)
        // Replace with your wallet update logic
        console.log(`Tokens added to user ${transaction.userId}: ${transaction.amount}`);

        // Update notification as transaction completed
        await Notification.updateOne({paymentReference, status:'success'})

        res.status(200).json({ success: true, message: 'Payment verified and tokens added' });
    } catch (err : any) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Payment verification failed', error: err.message });
    }
}