"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AdminSchema = new mongoose_1.Schema({
    totalUsers: { type: Number, required: true },
    totalUsersWalletBalance: { type: Number, required: true },
    todayNewUsers: { type: Number, required: true },
    todayBlockedUsers: { type: Number, default: 0 },
    todayGames: { type: Number, required: true },
    allGames: { type: Number, required: true },
    totalSuccessGame: { type: Number, default: 0 },
    todayCancelGame: { type: Number, required: true },
    totalAdminCommission: { type: Number, required: true },
    todayTotalDeposit: { type: Number, default: 0 },
    todayTotalWithdraw: { type: Number, default: 0 },
    todayWonAmount: { type: Number, default: 0 },
    totalPendingKYC: { type: Number, default: 0 },
    totalApprovedKYC: { type: Number, default: 0 },
    paymentSetting: {
        QR: { type: String, default: "" },
        UPI: { type: String, default: "" },
    },
    adminSetting: {
        phoneNumber: { type: String, default: "" },
        content: { type: String, default: "" },
    },
    createdAt: { type: Date, default: Date.now },
    Admins: { type: [String], default: ["7002926251", "9784889319", "8769422366"] },
});
exports.default = mongoose_1.default.model("Admin", AdminSchema);
