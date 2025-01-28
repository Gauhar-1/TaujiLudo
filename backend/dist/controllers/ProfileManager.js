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
exports.rejectKyc = exports.verifyKyc = exports.completeKYC = exports.updateAmount = exports.unBlockPlayer = exports.getBlockedOnes = exports.blockedPlayer = exports.findProfile = exports.getProfile = exports.updateProfile = exports.createProfile = void 0;
const Profile_1 = __importDefault(require("../models/Profile"));
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const createProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        console.log("PhoneNumber is not Missing " + phoneNumber);
    }
    try {
        const user = yield User_1.default.findOne({ phone: phoneNumber });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        const oldProfile = yield Profile_1.default.findOne({ phoneNumber });
        if (oldProfile) {
            return res.status(200).json(oldProfile);
        }
        const Referal = crypto_1.default.randomBytes(5).toString('hex');
        console.log("Referal: " + Referal);
        const profile = yield Profile_1.default.create({
            userId: user._id,
            name: "Noobie",
            email: "@gmail.com",
            phoneNumber,
            amount: 5,
            imgUrl: "image",
            status: "active",
            cashWon: 0,
            BattlePlayed: 0,
            Referal,
            gameWon: 0, // Corrected field name
            gameLost: 0, // Corrected field name
        });
        if (!profile) {
            console.log("Profile creation failed");
            return res.status(500).json({ message: "Profile creation failed" });
        }
        console.log("Profile creation success");
        res.status(200).json(profile);
    }
    catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ message: "Error creating profile", err });
    }
});
exports.createProfile = createProfile;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, name, email } = req.body;
    if (!name || !phoneNumber || !email) {
        return console.log('All fields are required.' + name + " " + phoneNumber + " " + email);
    }
    try {
        const updatedProfile = yield Profile_1.default.findOneAndUpdate({ phoneNumber }, { name, email }, { new: true });
        if (!updatedProfile) {
            console.log("Profile not found");
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(updatedProfile);
    }
    catch (err) {
        console.log("Error: " + err);
        res.status(500).json({ message: "Error updating profile", error: err });
    }
});
exports.updateProfile = updateProfile;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.find({
            status: "active",
            "kycDetails.status": "pending"
        }).sort({ createdAt: -1 });
        if (!profile) {
            console.log("profile not found");
        }
        if (profile.length === 0) {
            return res.status(404).json({ message: "No profiles with pending KYC found" });
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.getProfile = getProfile;
const findProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        let profile = yield Profile_1.default.find({ userId });
        if (!profile) {
            console.log("profile not found");
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.findProfile = findProfile;
const blockedPlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const user = yield User_1.default.findByIdAndUpdate(userId, {
            status: "blocked"
        });
        if (!user) {
            return console.log("User not found");
        }
        const profile = yield Profile_1.default.findOneAndUpdate({ userId }, {
            status: "blocked"
        });
        if (!profile) {
            return console.log("Profile not found");
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.blockedPlayer = blockedPlayer;
const getBlockedOnes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.find({ status: "blocked" }).sort({ createdAt: -1 });
        if (!profile) {
            return console.log("Profile not found");
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error :" + err);
    }
});
exports.getBlockedOnes = getBlockedOnes;
const unBlockPlayer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const user = User_1.default.findByIdAndUpdate(userId, {
            status: "active"
        });
        const profile = yield Profile_1.default.findOneAndUpdate({ userId }, {
            status: "active"
        });
        if (!profile) {
            console.log("Profile not found");
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.unBlockPlayer = unBlockPlayer;
const updateAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, amount } = req.body;
    if (!phoneNumber || !amount) {
        console.log("missing fields" + phoneNumber + " " + amount);
    }
    try {
        const profile = yield Profile_1.default.findOne({ phoneNumber });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'profile not found' });
        }
        profile.amount = amount;
        yield profile.save();
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Update Amount: " + error);
        res.status(500).json("Amount update feel: " + error);
    }
});
exports.updateAmount = updateAmount;
const completeKYC = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId, Name, DOB, state, documentName, documentNumber } = req.body;
    if (!userId || !Name || !DOB || !state || !documentName || !documentNumber) {
        console.log("Fields not found", userId, DOB, state, documentName, documentNumber);
    }
    if (!req.file) {
        console.log("file not found");
    }
    try {
        const profile = yield Profile_1.default.findOneAndUpdate({ userId }, {
            filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
            path: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
            kycDetails: {
                Name,
                DOB,
                state,
                documentName,
                documentNumber,
                status: "pending"
            }
        });
        if (!profile) {
            console.log("battle is not found");
        }
        res.status(200).json({ message: 'Image uploaded successfully', profile });
    }
    catch (err) {
        console.log("error: " + err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
exports.completeKYC = completeKYC;
const verifyKyc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: "Profile ID is required." });
    }
    try {
        // Find the transaction by payment reference
        const profile = yield Profile_1.default.findOne({ userId });
        if (!profile) {
            console.log('Profile not found');
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        // Update the transaction as completed
        if (profile.kycDetails)
            profile.kycDetails.status = 'verified';
        yield profile.save();
        // Add tokens to the user's wallet (mocked here)
        // Replace with your wallet update logic
        // Update notification as transaction completed
        // await Notification.updateOne({paymentReference : transaction.paymentReference, status:'success'})
        res.status(200).json({ success: true, message: 'Kyc verified and notification sent' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Kyc verification failed', error: err.message });
    }
});
exports.verifyKyc = verifyKyc;
const rejectKyc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reason } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: "Profile ID is required." });
    }
    if (!reason) {
        return res.status(400).json({ success: false, message: "reason is required." });
    }
    try {
        // Find the transaction by payment reference
        const profile = yield Profile_1.default.findOne({ userId });
        if (!profile) {
            console.log('Profile not found');
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        if (profile.kycDetails) {
            profile.kycDetails.status = 'pending';
            profile.kycDetails.reason = reason;
        }
        yield profile.save();
        // Update notification as transaction completed
        //   const notification = await Notification.findOneAndUpdate({paymentReference : transaction.paymentReference}, 
        //  { status:'failed', reason});
        // if (!notification) {
        //     console.log('notification not found');
        //     return res.status(404).json({ success: false, message: 'notification  not found' });
        // }
        res.status(200).json({ success: true, message: 'Kyc Rejected and notification sent' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Kyc rejection failed', error: err.message });
    }
});
exports.rejectKyc = rejectKyc;
