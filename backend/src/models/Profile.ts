import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User",unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, default: 0 },
  imgUrl: { type: String, required: true },
  cashWon: { type: Number, required: true, default: 0 },
  gameWon: { type: Number, required: true, default: 0 },
  kycDetails: {
    Name: { type: String, default: null },
    DOB: { type: String, default: null },
    state: { type: String, default: null },
    documentName: { type: String, default: null },
    documentNumber: { type: String, default: null },
    status: { type: String, default: null },
    frontView: { type: String, default: null },
    backView: { type: String, default: null },
    reason: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  battles : [ {
    battleId: {  type: mongoose.Schema.Types.ObjectId, ref: "Battle"  },
    timestamp: { type: Date, default: null },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  },],
  gameLost: { type: Number, required: true, default: 0 },
  BattlePlayed: { type: Number, required: true, default: 0 },
  Referal: { type: String, required: true },
  referredBy: { type: String, default: null },
  referalLink: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "blocked"],
    required: true,
    default: "active",
  },
  referrals: [
    {
      phoneNumber: { type: String, default: null },
      timestamp: { type: Date, default: null },
      referalEarning: { type: Number, default: 0 }, // Fixed type from string to number
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
