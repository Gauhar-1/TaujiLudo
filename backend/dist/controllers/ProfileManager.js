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
exports.getReferalEarning = exports.getReferal = exports.rejectKyc = exports.verifyKyc = exports.completeKYC = exports.updateAmount = exports.unBlockPlayer = exports.getBlockedOnes = exports.blockedPlayer = exports.findProfile = exports.kycCompletedProfiles = exports.getProfile = exports.updateProfile = void 0;
const Profile_1 = __importDefault(require("../models/Profile"));
const User_1 = __importDefault(require("../models/User"));
// export const createProfile = async (req: any, res: any, next: any) => {
//   const { phoneNumber } = req.body;
//   if (!phoneNumber) {
//     console.log("PhoneNumber is not Missing " + phoneNumber);
//   }
//   try {
//     const user = await User.findOne({phone: phoneNumber});
//     if (!user) {
//       console.log("User not found");
//       return res.status(404).json({ message: "User not found" });
//     }
//     const oldProfile = await Profile.findOne({ phoneNumber });
//     if (oldProfile) {
//       return res.status(200).json(oldProfile);
//     }
//     const Referal = crypto.randomBytes(5).toString('hex');
//     console.log("Referal: "+ Referal);
//     const referralLink = `https://taujiludo.in/?ref=${Referal}`;
//     const randomName = faker.person.firstName(); // Generates a random first name
// const randomEmail = `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`; // Generates a unique email
//     const profile = await Profile.create({
//       userId: user._id,
//       name: randomName,
//       email: randomEmail,
//       phoneNumber,
//       amount: 5,
//       imgUrl: "image",
//       status: "active",
//       cashWon: 0,
//       BattlePlayed: 0,
//       Referal,
//       referralLink,
//       gameWon: 0, // Corrected field name
//       gameLost: 0, // Corrected field name
//       "kycDetails.status" : "pending",
//     });
//     if (!profile) {
//       console.log("Profile creation failed");
//       return res.status(500).json({ message: "Profile creation failed" });
//     }
//     console.log("Profile creation success");
//     res.status(200).json(profile);
//   } catch (err) {
//     console.error("Error creating profile:", err);
//     res.status(500).json({ message: "Error creating profile", err});
//   }
// };
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
            $or: [
                { "kycDetails.status": "pending" },
                { "kycDetails.status": { $exists: false } },
            ]
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
const kycCompletedProfiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.find({
            status: "active",
            "kycDetails.status": "verified",
        }).sort({ createdAt: -1 });
        if (!profile) {
            console.log("profile not found");
        }
        if (profile.length === 0) {
            return res.status(404).json({ message: "No profiles with Verified KYC found" });
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.kycCompletedProfiles = kycCompletedProfiles;
const findProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.query;
    try {
        let profile = yield Profile_1.default.find({ phoneNumber });
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
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: "Missing required fields: phoneNumber" });
    }
    try {
        const profile = yield Profile_1.default.findOne({ phoneNumber });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }
        // Calculate total referral earnings
        const totalEarnings = profile.referrals.reduce((sum, referral) => sum + (referral.referalEarning || 0), 0);
        // Set total earnings
        profile.totalUserReferalEarning += Math.floor(totalEarnings);
        // Reset each referral's earnings to 0 (using a loop instead of .map())
        profile.referrals.forEach(referral => {
            referral.referalEarning = 0;
        });
        yield profile.save();
        res.status(200).json({ success: true, message: "Amount updated successfully", profile });
    }
    catch (error) {
        console.error("Update Amount Error:", error);
        res.status(500).json({ success: false, message: "Amount update failed", error: error.message });
    }
});
exports.updateAmount = updateAmount;
const completeKYC = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, Name, DOB, state, documentNumber } = req.body;
    if (!userId || !Name || !DOB || !state || !documentNumber) {
        console.log("Fields not found", userId, DOB, state, documentNumber);
    }
    if (!req.files || !req.files["image"] || !req.files["image2"]) {
        return res.status(400).json({ message: "Both images are required!" });
    }
    try {
        const profile = yield Profile_1.default.findOneAndUpdate({ userId }, {
            kycDetails: {
                Name,
                DOB,
                state,
                documentNumber,
                status: "pending",
                frontView: req.files["image"][0].filename,
                backView: req.files["image2"][0].filename,
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
        if (profile.kycDetails) {
            profile.kycDetails.status = 'verified';
            profile.kycDetails.createdAt = new Date();
        }
        yield profile.save();
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
            profile.kycDetails.createdAt = new Date();
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
const getReferal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        const profile = yield Profile_1.default.findOne({ userId });
        if (!profile)
            return res.status(404).json({ message: "profile not found" });
        const referralLink = `https://taujiludo.in/?ref=${profile.Referal}`;
        profile.referalLink = referralLink;
        yield profile.save();
        res.json({ referralLink });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getReferal = getReferal;
const getReferalEarning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        // Find the user and sum up referral earnings
        const profile = yield Profile_1.default.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        // Calculate total referral earnings
        if (amount > profile.totalUserReferalEarning) {
            return res.status(200).json({ message: "Insufficient Earning Amount" });
        }
        profile.amount += profile.totalUserReferalEarning;
        profile.totalUserReferalEarning -= amount;
        yield profile.save();
        return res.status(200).json({ totalReferralEarnings: profile.totalUserReferalEarning });
    }
    catch (error) {
        console.error("Error fetching referral earnings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getReferalEarning = getReferalEarning;
