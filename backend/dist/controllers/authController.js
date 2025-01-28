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
exports.verifyOtp = exports.sendOtp = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
exports.sendOtp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phoneNumber;
    if (!phone)
        return console.log('Phone number is required  0.');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        const user = yield User_js_1.default.findOneAndUpdate({ phone }, { otp, status: "active", otpExpires: new Date(Date.now() + 10 * 60 * 1000) }, { upsert: true, new: true });
        if (!user) {
            yield User_js_1.default.create({ phone }, { otp, status: "active", otpExpires: new Date(Date.now() + 10 * 60 * 1000) }, { upsert: true, new: true });
        }
        if (!phone)
            return console.log('Phone number is required  1.');
        const URL = `https://sms.renflair.in/V1.php?API=${process.env.API_KEY}&PHONE=${phone}&OTP=${otp}`;
        const response = yield axios_1.default.get(URL);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
}));
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     try {
//         const user = await User.findOneAndUpdate(
//             { phone },
//             { otp, status: "active",  otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
//             { upsert: true, new: true }
//         );
//         if(!user){
//             await User.create(
//                 { phone },
//                 { otp,status: "active", otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
//             { upsert: true, new: true }
//             );
//         }
//         if (!phone) 
//             return console.log('Phone number is required  1.' );
//         await sendOTP(phone, otp);
//         res.status(200).json({ 
//             success: true,
//             message: 'OTP sent successfully' });
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         next(error);
//         res.status(500).json({ error: 'Error sending OTP' });
//     }
// });
exports.verifyOtp = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phoneNumber;
    const otp = req.body.otp;
    try {
        const user = yield User_js_1.default.findOne({ phone, otp });
        if (!user) {
            return console.log('User not found');
        }
        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        // JWT generation logic here
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token: 'JWT_TOKEN',
            userId: user._id
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        next(error);
        res.status(500).json({ error: 'Error verifying OTP' });
    }
}));
