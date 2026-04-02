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
const resend_1 = require("resend");
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
exports.sendOtp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phoneNumber;
    const email = req.body.email;
    if (!phone || !email) {
        res.status(400).json({ success: false, message: 'Phone and Email are required.' });
        return;
    }
    try {
        let user = yield User_js_1.default.findOne({ phone });
        if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
            res.status(403).json({ success: false, message: "Your account is blocked. Contact support." });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const resendAvailableAt = new Date(Date.now() + 30 * 1000);
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
        // ✅ NEW: Send via Resend API (HTTPS Port 443 - Not blocked by Render!)
        const { data, error } = yield resend.emails.send({
            from: 'TaujiLudo <onboarding@resend.dev>', // Use your verified domain here later
            to: email,
            subject: 'TaujiLudo login verification code',
            html: `Your verification code is <strong>${otp}</strong>` // Put your beautiful HTML here
        });
        if (error) {
            console.error('Resend Error:', error);
            res.status(500).json({ error: 'Failed to send email' });
            return;
        }
        // 3. Return a more detailed response to the frontend if you want
        res.status(200).json({
            success: true,
            message: 'OTP sent to your email successfully',
            resendAfter: resendAvailableAt,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    }
    catch (error) {
        console.error('❌ Error sending OTP:', error);
        next(error);
    }
}));
exports.verifyOtp = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phoneNumber;
    const otp = req.body.otp;
    const ref = req.body.ref || "";
    try {
        const user = yield User_js_1.default.findOne({ phone, otp });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or invalid OTP' });
        }
        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
            return; // Add this line!
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
                amount: 500,
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
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, phoneNumber: user.phone, name: profile.name }, process.env.JWT_ACCESS_SECRET, // Add this to your .env
        { expiresIn: "15m" } // Short-lived!
        );
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, // Add this to your .env
        { expiresIn: "30d" } // Long-lived for Auto-Login
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Assuming your site is HTTPS
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            // domain: ".taujiludo.in" // Uncomment if using subdomains, but keep it consistent!
        });
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            accessToken,
            userId: user._id,
            name: profile.name
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Error verifying OTP' });
    }
}));
const autoLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Look for the Refresh Token cookie
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "No refresh token found, please login." });
    }
    try {
        // Verify the long-lived refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = yield Profile_js_1.default.findOne({ userId: decoded.userId });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        // Issue a brand new Access Token for the session
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.userId, phoneNumber: user.phoneNumber, name: user.name }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
        res.json({
            success: true,
            accessToken: newAccessToken,
            user
        });
    }
    catch (err) {
        console.error("🛑 Refresh Token Verification Failed:", err);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            // domain: ".taujiludo.in" // Must match verifyOtp!
        });
        return res.status(401).json({ success: false, message: "Session expired, please login again." });
    }
});
exports.autoLogin = autoLogin;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        // domain: ".taujiludo.in" // Only use this if you used it in verifyOtp
    });
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ success: true, message: "Logged out successfully." });
});
exports.logOut = logOut;
