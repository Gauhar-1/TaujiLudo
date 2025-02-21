// models/Battle.ts
import mongoose, { Schema, Document } from "mongoose";

interface IAdmin extends Document {
  totalUsers: string;  
  totalUsersWalletBallance: string;  
  todayNewUsers: string; 
  todayBlockedUsers: string;
  todayGames: string;
  allGames: string;
  totalSucessGame : string;
  todayCancelGame : string;
  totalAdminCommission : string;
  todayTotalDeposit: string;
  todayTotalWithdraw: string;
  todayWonAmount: string;
  totalPendingKYC: string;
  totalApprovedKYC: string;
  paymentSetting : {
    QR: string;
    UPI: string;
  };
  adminSetting : {
    phoneNumber : string;
    content : string;
  };
  createdAt: Date;
  Admins: string[];
}

const AdminSchema: Schema = new Schema({
    totalUsers: { type: String, requuired: true },
    totalUsersWalletBallance: { type: String, requuired: true },
    todayNewUsers: { type: String, requuired: true },
    todayBlockedUsers: { type: String, default: null }, 
    todayGames: { type: String, required: true },
    totalSucessGame: { type: String, default: null  },
    todayCancelGame: { type: Number, required: true },
    totalAdminCommission: { type: Number, required: true },
    todayTotalDeposit: { type: String, default: null },
    todayTotalWithdraw: { type: String, default: null },
    totalPendingKYC: { type: String, default: null },
    totalApprovedKYC: { type:String, default: null },
    paymentSetting : {
        QR:  { type: String, default: null },
        UPI: { type:String, default: null },
      },
      adminSetting : {
        phoneNumber : { type: String, default: null },
        content : { type:String, default: null },
      },
    createdAt: { type: Date, default: Date.now },
    Admins: { type: [String], default: ["7002926251"] },
});

export default mongoose.model<IAdmin>("Admin", AdminSchema);
