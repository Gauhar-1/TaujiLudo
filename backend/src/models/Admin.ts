import mongoose, { Schema, Document } from "mongoose";

interface IAdmin extends Document {
    totalUsers: number;
    totalUsersWalletBalance: number;
    todayNewUsers: number;
    todayBlockedUsers: number;
    todayGames: number;
    allGames: number;
    totalSuccessGame: number;
    todayCancelGame: number;
    totalAdminCommission: number;
    todayTotalDeposit: number;
    todayTotalWithdraw: number;
    todayWonAmount: number;
    totalPendingKYC: number;
    totalApprovedKYC: number;
    paymentSetting: {
        QR: string;
        UPI: string;
    };
    adminSetting: {
        phoneNumber: string;
        content: string;
    };
    createdAt: Date;
    Admins: string[];
}

const AdminSchema: Schema = new Schema({
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

export default mongoose.model<IAdmin>("Admin", AdminSchema);
