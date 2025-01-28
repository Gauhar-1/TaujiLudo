"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProfileSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    cashWon: { type: Number, required: true },
    gameWon: { type: Number, required: true },
    filename: { type: String, default: null },
    path: { type: String, default: null },
    kycDetails: {
        Name: { type: String, default: null },
        DOB: { type: String, default: null },
        state: { type: String, default: null },
        documentName: { type: String, default: null },
        documentNumber: { type: String, default: null },
        status: { type: String, default: null },
        reason: { type: String, default: null },
    },
    gameLost: { type: Number, required: true },
    BattlePlayed: { type: Number, required: true },
    Referal: { type: String, required: true },
    status: { type: String,
        enum: ["active", "blocked"], // Define allowed string values
        required: true, },
    createdAt: { type: Date, default: Date.now },
});
const Profile = mongoose_1.default.model('Profile', ProfileSchema);
exports.default = Profile;
