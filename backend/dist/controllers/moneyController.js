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
const Profile_1 = __importDefault(require("../models/Profile"));
const depositAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId, image, wallet, amount, paymentMethod, upiId, phoneNumber } = req.body;
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
        const paymentReference = crypto_1.default.randomBytes(8).toString('hex');
        // Save transaction in the database
        const transaction = yield Transaction_1.default.create({
            userId,
            phoneNumber,
            type: 'deposit',
            amount: parseFloat(amount),
            wallet: parseFloat(wallet),
            paymentMethod,
            paymentReference,
            status: 'pending',
            details: upiId,
            filename: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null,
            path: ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || null
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
    var _a;
    const { userId, wallet, amount, paymentMethod, destinationDetails, phoneNumber } = req.body;
    if (!req.body.userId || !mongoose_1.default.isValidObjectId(req.body.userId)) {
        return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    try {
        // Fetch user's balance (mocked here; implement in your User model)
        const paymentReference = crypto_1.default.randomBytes(8).toString('hex');
        if (wallet + amount < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
        }
        const profile = yield Profile_1.default.findOne({ userId });
        if (!profile) {
            console.log("Profile not found");
            return res.status(404).json({ success: false, message: "Profile not found" });
        }
        if (((_a = profile.kycDetails) === null || _a === void 0 ? void 0 : _a.status) !== "verified") {
            return res.status(404).json({ success: false, message: "Please Complete your Kyc first" });
        }
        // Deduct tokens and log the withdrawal request
        const transaction = yield Transaction_1.default.create({
            userId,
            phoneNumber,
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
        profile.amount = wallet; // Assuming `amount` is a number
        yield profile.save();
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
        const sanitizedTransactionId = typeof transactionId === "string" ? transactionId.replace(/:/g, "") : transactionId.toString();
        console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);
        // Find the transaction by payment reference
        const transaction = yield Transaction_1.default.findById(sanitizedTransactionId).lean(); // Use `.lean()` to return a plain object
        if (!transaction) {
            console.log("Transaction not found");
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }
        // Ensure userId is a string
        const userId = transaction.userId;
        if (!userId) {
            console.log("userId not found");
            return res.status(400).json({ success: false, message: "User ID not found in transaction" });
        }
        const profile = yield Profile_1.default.findOne({ userId });
        if (!profile) {
            console.log("Profile not found");
            return res.status(404).json({ success: false, message: "Profile not found" });
        }
        // Ensure `transaction.wallet` is a valid number before assigning
        if (typeof transaction.wallet !== "number") {
            console.log("Invalid wallet amount:", transaction.wallet);
            return res.status(400).json({ success: false, message: "Invalid wallet amount" });
        }
        if (transaction.type === "deposit") {
            profile.amount = transaction.wallet; // Assuming `amount` is a number
            yield profile.save();
        }
        console.log(`Tokens added to user ${transaction.userId}: ${transaction.amount}`);
        // Update transaction status
        yield Transaction_1.default.findByIdAndUpdate(sanitizedTransactionId, { $set: { status: "completed" } });
        // Update notification as transaction completed
        yield Trans_notification_1.Notification.updateOne({ paymentReference: transaction.paymentReference }, { $set: { status: "success" },
            createdAt: new Date().toISOString(),
        });
        res.status(200).json({ success: true, message: "Payment verified and tokens added" });
    }
    catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
    }
});
exports.verifyPayment = verifyPayment;
const rejectPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, reason, userId } = req.body;
    if (!transactionId) {
        return res.status(400).json({ success: false, message: "Transaction ID is required." });
    }
    if (!reason) {
        return res.status(400).json({ success: false, message: "Reason is required." });
    }
    try {
        // ✅ Validate Transaction ID
        if (!mongoose_1.default.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ success: false, message: "Invalid transaction ID." });
        }
        const sanitizedTransactionId = new mongoose_1.default.Types.ObjectId(transactionId);
        console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);
        // ✅ Find the transaction
        const transaction = yield Transaction_1.default.findById(sanitizedTransactionId);
        if (!transaction) {
            console.log("Transaction not found");
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }
        // ✅ Update transaction status
        transaction.status = "failed";
        yield transaction.save();
        console.log(`Tokens didn't add to user ${transaction.userId}: ${transaction.amount}`);
        // ✅ Update notification, create if not found
        const notification = yield Trans_notification_1.Notification.findOneAndUpdate({ paymentReference: transaction.paymentReference }, {
            status: "failed",
            reason,
            createdAt: new Date().toISOString(),
        }, { new: true, upsert: true });
        // ✅ Find user profile
        const profile = yield Profile_1.default.findOneAndUpdate({ userId }, { $inc: { amount: transaction.amount } }, { new: true });
        if (!profile) {
            return res.status(400).json("Profile not found");
        }
        return res.status(200).json({ success: true, message: "Payment rejected and tokens not added" });
    }
    catch (error) {
        console.error("Error rejecting payment:", error);
        return res.status(500).json({ success: false, message: "Payment rejection failed", error: error.message });
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
