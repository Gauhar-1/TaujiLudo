"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTransaction = exports.ReqTransaction = exports.AllTransaction = exports.getTransaction = exports.paymentProof = exports.rejectPayment = exports.verifyPayment = exports.withdrawAmount = exports.depositAmount = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Trans_notification_1 = require("../models/Trans-notification");
const crypto_1 = __importDefault(require("crypto"));
const notifyController_1 = require("./notifyController");
const mongoose_1 = __importDefault(require("mongoose"));
const depositAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, image, wallet, amount, paymentMethod, upiId } = req.body;
    // Validate file upload
    if (!req.file) {
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
        const paymentReference = crypto_1.default.randomBytes(8).toString('hex');
        // Save transaction in the database
        const transaction = yield Transaction_1.default.create({
            userId,
            type: 'deposit',
            amount: parseFloat(amount),
            wallet: parseFloat(wallet),
            paymentMethod,
            paymentReference,
            status: 'pending',
            details: upiId,
            filename: req.file.filename,
            path: req.file.path
        });
        yield (0, notifyController_1.createNotification)(userId, 'deposit', `Your deposit of ${amount} tokens was successful.`, paymentReference, 'pending', amount);
        // Simulate UPI link (replace with QR code generation in production)
        const upiLink = `upi://pay?pa=${upiId}&pn=BettingGateway&am=${amount}&tn=${paymentReference}`;
        res.status(200).json({
            success: true,
            message: 'Deposit initiated. Complete the payment.',
            upiLink,
            transaction,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Deposit failed', error: err.message });
    }
});
exports.depositAmount = depositAmount;
const withdrawAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, wallet, amount, paymentMethod, destinationDetails } = req.body;
    if (!req.body.userId || !mongoose_1.default.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    try {
        // Fetch user's balance (mocked here; implement in your User model)
        const paymentReference = crypto_1.default.randomBytes(8).toString('hex');
        if (wallet + amount < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
        }
        // Deduct tokens and log the withdrawal request
        const transaction = yield Transaction_1.default.create({
            userId,
            type: 'withdraw',
            amount,
            wallet,
            paymentMethod,
            paymentReference,
            status: 'pending',
            details: destinationDetails
        });
        if (!transaction) {
            console.log("Failed to create withdraw");
        }
        yield (0, notifyController_1.createNotification)(userId, 'withdrawal', `Your whithdrwal of ${amount} tokens was successful.`, paymentReference, 'pending', amount);
        console.log("notification is passed");
        res.status(200).json({
            success: true,
            message: 'Withdrawal request submitted. It will be processed manually.',
            transaction,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Withdrawal failed', error: err.message });
    }
});
exports.withdrawAmount = withdrawAmount;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.body;
    if (!transactionId) {
        return res.status(400).json({ success: false, message: "Transaction ID is required." });
    }
    try {
        const sanitizedTransactionId = transactionId.toString().replace(/:/g, "");
        console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);
        // Find the transaction by payment reference
        const transaction = yield Transaction_1.default.findById(sanitizedTransactionId);
        if (!transaction) {
            console.log('Transaction not found');
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        // Update the transaction as completed
        transaction.status = 'completed';
        yield transaction.save();
        // Add tokens to the user's wallet (mocked here)
        // Replace with your wallet update logic
        console.log(`Tokens added to user ${transaction.userId}: ${transaction.amount}`);
        // Update notification as transaction completed
        yield Trans_notification_1.Notification.updateOne({ paymentReference: transaction.paymentReference, status: 'success' });
        res.status(200).json({ success: true, message: 'Payment verified and tokens added' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Payment verification failed', error: err.message });
    }
});
exports.verifyPayment = verifyPayment;
const rejectPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, reason } = req.body;
    if (!transactionId) {
        return res.status(400).json({ success: false, message: "Transaction ID is required." });
    }
    if (!reason) {
        return res.status(400).json({ success: false, message: "reason is required." });
    }
    try {
        const sanitizedTransactionId = transactionId.toString().replace(/:/g, "");
        console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);
        // Find the transaction by payment reference
        const transaction = yield Transaction_1.default.findById(sanitizedTransactionId);
        if (!transaction) {
            console.log('Transaction not found');
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        transaction.status = 'failed';
        yield transaction.save();
        // Update the transaction as completed
        // Add tokens to the user's wallet (mocked here)
        // Replace with your wallet update logic
        console.log(`Tokens didn't add to user ${transaction.userId}: ${transaction.amount}`);
        // Update notification as transaction completed
        const notification = yield Trans_notification_1.Notification.findOneAndUpdate({ paymentReference: transaction.paymentReference }, { status: 'failed', reason });
        if (!notification) {
            console.log('notification not found');
            return res.status(404).json({ success: false, message: 'notification  not found' });
        }
        res.status(200).json({ success: true, message: 'Payment Rejected and tokens not added' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Payment rejection failed', error: err.message });
    }
});
exports.rejectPayment = rejectPayment;
const paymentProof = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (userId) {
        console.log("battleId not found", userId);
        console.log("Type Of" + typeof userId);
    }
    if (req.file.filename || req.file.path) {
        console.log("file not found", req.file);
    }
    try {
        // Find the transaction by userId
        const transaction = yield Transaction_1.default.findOneAndUpdate({ userId }, {
            filename: req.file.filename,
            path: req.file.path
        });
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
    }
    catch (err) {
        console.log("error: " + err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
exports.paymentProof = paymentProof;
const getTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const transaction = yield Transaction_1.default.find({ userId }).sort({ date: -1 });
        if (!transaction) {
            return console.log("Transaction not found");
        }
        res.status(200).json(transaction);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.getTransaction = getTransaction;
const AllTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield Transaction_1.default.find().sort({ date: -1 });
        if (!transaction) {
            return console.log("Transaction not found");
        }
        res.status(200).json(transaction);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.AllTransaction = AllTransaction;
const ReqTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield Transaction_1.default.find({ status: "pending" }).sort({ date: -1 });
        if (!transaction) {
            return console.log("Transaction not found");
        }
        res.status(200).json(transaction);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.ReqTransaction = ReqTransaction;
const findTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.query;
    if (paymentId) {
        console.log("paymentId : " + paymentId);
    }
    try {
        const transaction = yield Transaction_1.default.findById(paymentId);
        if (!transaction) {
            return console.log("Transaction not found");
        }
        res.status(200).json(transaction);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.findTransaction = findTransaction;
