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
exports.onlyAdmins = exports.getAdmin = exports.UPIsettings = exports.QRsettings = exports.infoSettings = exports.supportSettings = exports.createAdminDetails = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const Profile_1 = __importDefault(require("../models/Profile"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const User_1 = __importDefault(require("../models/User"));
const Battle_1 = __importDefault(require("../models/Battle"));
const createAdminDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sumFieldValues = (Model_1, field_1, ...args_1) => __awaiter(void 0, [Model_1, field_1, ...args_1], void 0, function* (Model, field, filter = {}) {
            try {
                const pipeline = [];
                // Add filter condition only if it exists
                if (Object.keys(filter).length > 0) {
                    pipeline.push({ $match: filter });
                }
                pipeline.push({
                    $group: { _id: null, total: { $sum: `$${field}` } }
                });
                const result = yield Model.aggregate(pipeline);
                return result.length > 0 ? result[0].total : 0;
            }
            catch (err) {
                console.error(`Error summing ${field}:`, err);
                return 0;
            }
        });
        const getTotalCount = (Model, field, value) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield Model.countDocuments(field ? { [field]: value } : {});
            }
            catch (err) {
                console.error(`Error counting documents in ${Model.collection.name}:`, err);
                return 0;
            }
        });
        const calculateTotalAmount = (transactionType) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Get start of the day (midnight)
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const totalAmount = yield Transaction_1.default.aggregate([
                    { $match: { type: transactionType, date: { $gte: startOfDay }, status: "completed" } }, // Filter by transaction type
                    { $group: { _id: null, total: { $sum: "$amount" } } }, // Sum all amounts
                ]);
                return totalAmount.length > 0 ? totalAmount[0].total : 0; // Return total or 0 if no transactions
            }
            catch (error) {
                console.error("Error calculating total amount:", error);
                return 0;
            }
        });
        const getTodaysCount = (Model, field, value) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                let filter = { createdAt: { $gte: startOfDay } };
                if (field && !value) {
                    return yield sumFieldValues(Model, field, filter);
                }
                if (field && value) {
                    filter[field] = value;
                }
                return field ? yield Model.countDocuments(filter) : yield Model.countDocuments(filter);
            }
            catch (err) {
                console.error(`Error getting today's count for ${Model.collection.name}:`, err);
                return 0;
            }
        });
        const getCommission = () => __awaiter(void 0, void 0, void 0, function* () {
            const [entry, prize] = yield Promise.all([
                sumFieldValues(Battle_1.default, "amount"),
                sumFieldValues(Battle_1.default, "prize"),
            ]);
            return (2 * entry) - prize;
        });
        const [totalUsers, totalUsersWalletBalance, todayNewUsers, todayBlockedUsers, todayGames, allGames, totalSuccessGame, todayCancelGame, totalAdminCommission, todayTotalDeposit, todayTotalWithdraw, todayWonAmount, totalPendingKYC, totalApprovedKYC] = yield Promise.all([
            getTotalCount(User_1.default, "status", "active"),
            sumFieldValues(Profile_1.default, "amount"),
            getTodaysCount(Profile_1.default, "status", "active"),
            getTodaysCount(Profile_1.default, "status", "blocked"),
            getTodaysCount(Battle_1.default),
            getTotalCount(Battle_1.default),
            getTotalCount(Battle_1.default, "status", "completed"),
            getTodaysCount(Battle_1.default, "status", "canceled"),
            getCommission(),
            calculateTotalAmount("deposit"),
            calculateTotalAmount("withdraw"),
            getTodaysCount(Battle_1.default, "prize"),
            getTotalCount(Profile_1.default, "kycDetails.status", "pending"),
            getTotalCount(Profile_1.default, "kycDetails.status", "verified")
        ]);
        const adminDetails = {
            totalUsers,
            totalUsersWalletBalance,
            todayNewUsers,
            todayBlockedUsers,
            todayGames,
            allGames,
            totalSuccessGame,
            todayCancelGame,
            totalAdminCommission,
            todayTotalDeposit,
            todayTotalWithdraw,
            todayWonAmount,
            totalPendingKYC,
            totalApprovedKYC,
            createdAt: new Date(),
        };
        const updatedAdmin = yield Admin_1.default.findOneAndUpdate({}, adminDetails, { upsert: true, new: true });
        console.log("Admin details updated successfully.");
        res.status(200).json({ message: "Admin details updated successfully.", data: updatedAdmin });
    }
    catch (err) {
        console.error("Error updating admin details:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createAdminDetails = createAdminDetails;
const supportSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: "PhoneNumber missing" });
        }
        const admin = yield Admin_1.default.findOneAndUpdate({}, { $set: { "adminSetting.phoneNumber": phoneNumber } }, { new: true } // Returns the updated document
        );
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.status(200).json({ message: "Support setting changed successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.supportSettings = supportSettings;
const infoSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }
        const admin = yield Admin_1.default.findOneAndUpdate({}, { $set: { "adminSetting.content": content } }, { new: true });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.status(200).json({ message: "Info setting changed successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.infoSettings = infoSettings;
const QRsettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            console.log("File not found", req.file);
            return res.status(400).json({ success: false, message: "File not found. Please upload a valid file." });
        }
        const admin = yield Admin_1.default.findOneAndUpdate({}, { $set: { "paymentSetting.QR": req.file.filename } }, { new: true });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        return res.status(200).json({ success: true, message: "QR settings updated successfully", filename: req.file.filename });
    }
    catch (error) {
        console.error("Error updating QR settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});
exports.QRsettings = QRsettings;
const UPIsettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { UPI } = req.body;
        if (!UPI) {
            console.log("UPI not found", UPI);
            return res.status(400).json({ success: false, message: "UPI not found." });
        }
        const admin = yield Admin_1.default.findOneAndUpdate({}, { $set: { "paymentSetting.UPI": UPI } }, { new: true });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        return res.status(200).json({ success: true, message: "UPI settings updated successfully", UPI });
    }
    catch (error) {
        console.error("Error updating QR settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});
exports.UPIsettings = UPIsettings;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.default.find();
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        return res.status(200).json({ success: true, message: "UPI settings updated successfully", admin });
    }
    catch (error) {
        console.error("Error updating QR settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});
exports.getAdmin = getAdmin;
const onlyAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.query;
        // ✅ Fetch the stored admin phone number
        const admin = yield Admin_1.default.findOne();
        if (!admin || !admin.Admins.includes(phoneNumber)) {
            return res.status(403).json({ isAdmin: false, message: "Access denied" });
        }
        return res.status(200).json({ isAdmin: true });
    }
    catch (error) {
        console.error("Error checking admin:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.onlyAdmins = onlyAdmins;
