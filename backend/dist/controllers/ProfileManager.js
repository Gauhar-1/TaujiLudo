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
exports.updateAmount = exports.getProfile = exports.updateProfile = exports.createProfile = void 0;
const Profile_1 = __importDefault(require("../models/Profile"));
const User_1 = __importDefault(require("../models/User"));
const createProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.query;
    if (phoneNumber) {
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
        const profile = yield Profile_1.default.create({
            userId: user._id,
            name: "Noobie",
            email: "@gmail.com",
            phoneNumber,
            amount: 5,
            imgUrl: "image",
            cashWon: 0,
            BattlePlayed: 0,
            Referal: 0,
            gameWon: 0, // Corrected field name
            gameLost: 0, // Corrected field name
        });
        if (!profile) {
            console.log("Profile creation failed");
            return res.status(500).json({ message: "Profile creation failed" });
        }
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
        const profile = yield Profile_1.default.find();
        if (!profile) {
            console.log("profile not found");
        }
        res.status(200).json(profile);
    }
    catch (err) {
        console.log("Error: " + err);
    }
});
exports.getProfile = getProfile;
const updateAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, amount } = req.body;
    if (!phoneNumber || !amount) {
        console.log("missing fields" + phoneNumber + " " + amount);
    }
    try {
        const profile = yield Profile_1.default.findOneAndUpdate({ phoneNumber }, { amount });
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Update Amount: " + error);
        res.status(500).json("Amount update feel: " + error);
    }
});
exports.updateAmount = updateAmount;
