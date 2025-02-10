import Transaction from "../models/Transaction";
import { Notification } from "../models/Trans-notification";
import crypto from 'crypto';
import { randomBytes } from "crypto";
import { createNotification } from "./notifyController";
import mongoose from "mongoose";
import { json } from "body-parser";
import Admin from "../models/Admin";
import Profile from "../models/Profile";

export const depositAmount = async (req : any,res : any,next: any) => {
    const { userId,image,wallet, amount, paymentMethod, upiId } = req.body;
    

    // Validate file upload
    if (!req.file && upiId !== "admin") {
        console.log("File not found", req.file);
        return res.status(400).json({ success: false, message: 'File not found. Please upload a valid file.' });
    }

    // Validate userId
    if (!userId) {
        return res.status(400).json({ success: false, message: 'Invalid or missing userId.' });
    }

    // Validate amount and wallet
    if (isNaN(parseFloat(amount)) || isNaN(parseFloat(wallet))) {
        return res.status(400).json({ success: false, message: 'Invalid amount or wallet value.' });
    }


    try {
        // Generate a unique payment reference (e.g., transaction ID or QR code)
        const paymentReference = crypto.randomBytes(8).toString('hex');

        // Save transaction in the database
        const transaction = await Transaction.create({
            userId,
            type: 'deposit',
            amount : parseFloat(amount),
            wallet: parseFloat(wallet),
            paymentMethod,
            paymentReference,
            status: 'pending',
            details: upiId,
            filename: req.file?.filename || null,
            path: req.file?.path || null
        })

        await createNotification(
            userId, 
            'deposit', 
            `Your deposit of ${amount} tokens was successful.`,
             paymentReference,
             'pending',
             amount,
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
    const { userId,wallet, amount, paymentMethod, destinationDetails} = req.body;

    if (!req.body.userId || !mongoose.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
      }
      

    try {
        // Fetch user's balance (mocked here; implement in your User model)

        const paymentReference = crypto.randomBytes(8).toString('hex')

        if (wallet+amount < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
        }
        

        // Deduct tokens and log the withdrawal request
        const transaction = await Transaction.create({
            userId,
            type: 'withdraw',
            amount,
            wallet,
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

export const verifyPayment = async (req: any, res: any) => {
    const { transactionId } = req.body;

    if (!transactionId) {
        return res.status(400).json({ success: false, message: "Transaction ID is required." });
    }

    try {
        const sanitizedTransactionId = typeof transactionId === "string" ? transactionId.replace(/:/g, "") : transactionId.toString();
        console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);

        // Find the transaction by payment reference
        const transaction = await Transaction.findById(sanitizedTransactionId).lean(); // Use `.lean()` to return a plain object

        if (!transaction) {
            console.log("Transaction not found");
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        // Ensure userId is a string
        const userId = transaction.userId 
        if (!userId) {
            console.log("userId not found");
            return res.status(400).json({ success: false, message: "User ID not found in transaction" });
        }

        const profile = await Profile.findOne({userId});
        if (!profile) {
            console.log("Profile not found");
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // Ensure `transaction.wallet` is a valid number before assigning
        if (typeof transaction.wallet !== "number") {
            console.log("Invalid wallet amount:", transaction.wallet);
            return res.status(400).json({ success: false, message: "Invalid wallet amount" });
        }

        profile.amount = transaction.wallet; // Assuming `amount` is a number
        await profile.save();

        console.log(`Tokens added to user ${transaction.userId}: ${transaction.amount}`);

        // Update transaction status
        await Transaction.findByIdAndUpdate(sanitizedTransactionId, { $set: { status: "completed" } });

        // Update notification as transaction completed
        await Notification.updateOne(
            { paymentReference: transaction.paymentReference },
            { $set: { status: "success" },
            createdAt : new Date().toISOString(),
        }
        );

        res.status(200).json({ success: true, message: "Payment verified and tokens added" });
    } catch (err: any) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
    }
};


export const  rejectPayment = async (req: any ,res : any) => {
    const { transactionId , reason } = req.body;

    if (!transactionId) {
        return res.status(400).json({ success: false, message: "Transaction ID is required." });
    }
    if (! reason ) {
        return res.status(400).json({ success: false, message: "reason is required." });
    }

    try {

        const sanitizedTransactionId = transactionId.toString().replace(/:/g, "");

        console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);

        // Find the transaction by payment reference
        const transaction = await Transaction.findById(sanitizedTransactionId);

        if (!transaction) {
            console.log('Transaction not found');
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        transaction.status = 'failed';
        await transaction.save();

        // Update the transaction as completed
        // Add tokens to the user's wallet (mocked here)
        // Replace with your wallet update logic
        console.log(`Tokens didn't add to user ${transaction.userId}: ${transaction.amount}`);

        // Update notification as transaction completed
        const notification = await Notification.findOneAndUpdate({paymentReference : transaction.paymentReference}, 
       { status:'failed', 
        reason,
        createdAt : new Date().toISOString(),
       });

        if (!notification) {
            console.log('notification not found');
            return res.status(404).json({ success: false, message: 'notification  not found' });
        }

        res.status(200).json({ success: true, message: 'Payment Rejected and tokens not added' });
    } catch (err : any) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Payment rejection failed', error: err.message });
    }
}

export const paymentProof = async(req: any, res: any, next: any)=>{

    const { userId  }  = req.body;

    if(userId){
        console.log("battleId not found",userId);
        console.log( "Type Of"+typeof userId);
    }
    if(req.file.filename || req.file.path){
        console.log("file not found", req.file);
    }
 
    try {
        // Find the transaction by userId
    const transaction = await Transaction.findOneAndUpdate({ userId },
        {
            filename: req.file.filename,
            path: req.file.path
        }
    );

    if (transaction) {
      console.log("Transaction is not found");
    //   return res.status(404).json({ error: "Transaction not found" });
    }

    // // If transaction is found, update filename and path if necessary
    // transaction.filename = req.file.filename;
    // transaction.path = req.file.path;

    // // Save the updated transaction
    // await transaction.save();    

    res.status(200).json({ message: "Image uploaded successfully", transaction });
      } catch (err) {
        console.log("error: " + err);
        res.status(500).json({ error: 'Failed to upload image' });
      }
}

export const getTransaction = async(req: any, res: any, next:any)=>{
    const { userId } = req.query;
    try{
        const transaction = await Transaction.find({userId}).sort({ date : -1 });

        if(!transaction){
            return console.log("Transaction not found");
        }

        res.status(200).json(transaction);
    }
    catch(err){
        console.log("Error: "+ err);
    }
}
export const AllTransaction = async(req: any, res: any, next:any)=>{
    try{
        const transaction = await Transaction.find().sort({ date : -1 });

        if(!transaction){
            return console.log("Transaction not found");
        }

        res.status(200).json(transaction);
    }
    catch(err){
        console.log("Error: "+ err);
    }
}
export const ReqTransaction = async(req: any, res: any, next:any)=>{
    try{
        const transaction = await Transaction.find({status : "pending"}).sort({ date : -1 });

        if(!transaction){
            return console.log("Transaction not found");
        }

        res.status(200).json(transaction);
    }
    catch(err){
        console.log("Error: "+ err);
    }
}
export const findTransaction = async(req: any, res: any, next:any)=>{
    const { paymentId } = req.query;

    if(paymentId){
        console.log("paymentId : " + paymentId);
    }
    try{
        const transaction = await Transaction.findById(paymentId);

        if(!transaction){
            return console.log("Transaction not found");
        }

        res.status(200).json(transaction);
    }
    catch(err){
        console.log("Error: "+ err);
    }
}

