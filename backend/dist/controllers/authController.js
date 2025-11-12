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
exports.logOut = exports.autoLogin = exports.verifyOtp = exports.sendOtp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../models/User.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Profile_js_1 = __importDefault(require("../models/Profile.js"));
const faker_1 = require("@faker-js/faker");
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
exports.sendOtp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phoneNumber;
    if (!phone) {
        res.status(400).json({ success: false, message: 'Phone number is required.' });
        return;
    }
    try {
        // ✅ Check if user exists
        let user = yield User_js_1.default.findOne({ phone });
        if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
            res.status(403).json({ success: false, message: "Your account is blocked. Contact support." });
            return;
        }
        // ✅ Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const resendAvailableAt = new Date(Date.now() + 30 * 1000);
        // ✅ If user exists, update; otherwise, create a new user
        if (user) {
            user.otp = otp;
            user.status = "active";
            user.otpExpires = otpExpires;
            user.resendAvailableAt = resendAvailableAt;
            yield user.save();
        }
        else {
            yield User_js_1.default.create({
                phone,
                otp,
                status: "active",
                otpExpires,
                resendAvailableAt
            });
        }
        // ✅ Send OTP via SMS API
        // const URL = `https://sms.renflair.in/V1.php?API=${process.env.API_KEY}&PHONE=${phone}&OTP=${otp}`;
        // await axios.get(URL);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            resendAfter: resendAvailableAt,
            otp: otp
        });
    }
    catch (error) {
        console.error('❌ Error sending OTP:', error);
        next(error); // Pass the error to the global error handler
    }
}));
exports.verifyOtp = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phoneNumber;
    const otp = req.body.otp;
    const ref = req.body.ref || "";
    try {
        const user = yield User_js_1.default.findOne({ phone, otp });
        if (!user) {
            return console.log('User not found');
        }
        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        let profile = yield Profile_js_1.default.findOne({
            userId: user._id
        });
        if (!profile) {
            const Referal = crypto_1.default.randomBytes(5).toString('hex');
            console.log("Referal: " + Referal);
            const referalLink = `https://taujiludo.in/?ref=${Referal}`;
            const randomName = faker_1.faker.person.firstName(); // Generates a random first name
            const randomEmail = `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`; // Generates a unique email
            profile = yield Profile_js_1.default.create({
                userId: user._id,
                name: randomName,
                email: randomEmail,
                phoneNumber: phone,
                amount: 5,
                imgUrl: "image",
                status: "active",
                cashWon: 0,
                BattlePlayed: 0,
                Referal,
                referalLink,
                gameWon: 0, // Corrected field name
                gameLost: 0, // Corrected field name
                "kycDetails.status": "pending",
            });
            let referredByUser = null;
            if (ref) {
                referredByUser = yield Profile_js_1.default.findOne({ Referal: ref });
                if (referredByUser) {
                    referredByUser.referrals.push({ phoneNumber: phone, timestamp: new Date(), referalEarning: 0 }); // Example earning amount
                    yield referredByUser.save();
                    profile.referredBy = referredByUser.phoneNumber;
                    yield profile.save();
                }
            }
        }
        // JWT generation logic here
        const token = jsonwebtoken_1.default.sign({ userId: user._id, phoneNumber: user.phone, name: profile.name }, process.env.JWT_SECRET, // Ensure JWT_SECRET is set in env
        { expiresIn: "7d" } // Token valid for 7 days
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Use only in HTTPS
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token,
            userId: user._id,
            name: profile.name
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        next(error);
        res.status(500).json({ error: 'Error verifying OTP' });
    }
}));
const autoLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        console.log("🛑 No token found, returning 401");
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!process.env.JWT_SECRET) {
        console.error("🛑 JWT_SECRET is not defined in environment variables.");
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield Profile_js_1.default.findOne({ userId: decoded.userId });
        if (!user) {
            console.log("🛑 User not found, returning 401");
            return res.status(401).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    }
    catch (err) {
        console.error("🛑 JWT Verification Failed:", err);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});
exports.autoLogin = autoLogin;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, // Secure only in production
        sameSite: "none",
        expires: new Date(0),
        domain: ".taujiludo.in"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
        domain: ".taujiludo.in"
    });
    res.clearCookie("sessionId", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
        domain: ".taujiludo.in"
    });
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ success: true, message: "Logged out successfully. All cookies cleared." });
});
exports.logOut = logOut;
