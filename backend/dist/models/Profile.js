"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProfileSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, },
    phoneNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    cashWon: { type: Number, required: true },
    gameWon: { type: Number, required: true },
    gameLost: { type: Number, required: true },
    BattlePlayed: { type: Number, required: true },
    Referal: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Profile = mongoose_1.default.model('Profile', ProfileSchema);
exports.default = Profile;
