import mongoose, { Schema, Document } from "mongoose";

interface BattleEvent {
  event: "opponent_found" | "player_entered" | "opponent_entered" | "opponent_canceled" | "ludoCode_set";
  timestamp: Date;
  details?: string; // Optional details
}

interface IBattle extends Document {
  player1Name: string;
  player2Name: string | null;
  player1: string;
  player2: string | null;
  amount: number;
  prize: number;
  filename: string | null;
  path: string | null;
  status: "pending" | "in-progress" | "canceled" | "completed";
  ludoCode: string | null;
  winner: string | null;
  reason: string | null;
  createdAt: Date;
  history: BattleEvent[]; // Added history field
}

const BattleSchema: Schema = new Schema({
  player1Name: { type: String, required: true },
  player2Name: { type: String, default: null },
  player1: { type: String, required: true },
  player2: { type: String, default: null },
  amount: { type: Number, required: true },
  prize: { type: Number, required: true },
  filename: { type: String, default: null },
  path: { type: String, default: null },
  status: { type: String, enum: ["pending", "in-progress", "canceled", "completed"], default: "pending" },
  ludoCode: { type: String, default: null },
  winner: { type: String, default: null },
  reason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },

  // ✅ Event history tracking
  history: [
    {
      event: { type: String, enum: ["opponent_found", "player_entered", "opponent_entered", "opponent_canceled","ludoCode_set"], required: true },
      timestamp: { type: Date, default: Date.now },
      details: { type: String },
    },
  ],
});

export default mongoose.model<IBattle>("Battle", BattleSchema);
