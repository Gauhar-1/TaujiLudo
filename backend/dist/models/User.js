"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    phone: { type: String, required: true, unique: true },
    otp: { type: String, required: false },
    status: { type: String,
        enum: ["active", "blocked"], // Define allowed string values
        required: true, },
    otpExpires: { type: Date, required: false },
    resendAvailableAt: { type: Date, required: true },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
