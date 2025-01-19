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
exports.verifyPayment = exports.withdrawAmount = exports.depositAmount = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Trans_notification_1 = require("../models/Trans-notification");
const crypto_1 = __importDefault(require("crypto"));
const notifyController_1 = require("./notifyController");
const mongoose_1 = __importDefault(require("mongoose"));
const depositAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount, paymentMethod, upiId } = req.body;
    if (!req.body.userId || !mongoose_1.default.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    try {
        // Generate a unique payment reference (e.g., transaction ID or QR code)
        const paymentReference = crypto_1.default.randomBytes(8).toString('hex');
        // Save transaction in the database
        const transaction = yield Transaction_1.default.create({
            userId,
            type: 'deposit',
            amount,
            paymentMethod,
            paymentReference,
            status: 'pending',
            details: upiId
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
    const { userId, amount, paymentMethod, destinationDetails } = req.body;
    if (!req.body.userId || !mongoose_1.default.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    try {
        // Fetch user's balance (mocked here; implement in your User model)
        const userBalance = 100000; // Replace with actual wallet balance from the database
        const paymentReference = crypto_1.default.randomBytes(8).toString('hex');
        if (userBalance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
        }
        // Deduct tokens and log the withdrawal request
        const transaction = yield Transaction_1.default.create({
            userId,
            type: 'withdraw',
            amount,
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
    const { paymentReference, transactionId } = req.body;
    try {
        // Find the transaction by payment reference
        const transaction = yield Transaction_1.default.findOne({ paymentReference, status: 'pending' });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        // Update the transaction as completed
        transaction.status = 'completed';
        yield transaction.save();
        // Add tokens to the user's wallet (mocked here)
        // Replace with your wallet update logic
        console.log(`Tokens added to user ${transaction.userId}: ${transaction.amount}`);
        // Update notification as transaction completed
        yield Trans_notification_1.Notification.updateOne({ paymentReference, status: 'success' });
        res.status(200).json({ success: true, message: 'Payment verified and tokens added' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Payment verification failed', error: err.message });
    }
});
exports.verifyPayment = verifyPayment;
