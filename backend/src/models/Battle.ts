import mongoose, { Schema, Document } from "mongoose";

interface BattleEvent {
  event: "opponent_found" | "player_entered" | "opponent_entered" | "opponent_canceled" | "ludoCode_set";
  timestamp: Date;
  details?: string; // Optional details
}

interface Dispute {
  players: string[]; // Players who claim they won
  proofs: { player: string; filename: string; path: string }[]; // Screenshot uploads
  resolved: boolean;
  winner: string | null; // Final decision
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
  status: "pending" | "in-progress" | "canceled" | "completed" | "disputed";
  ludoCode: string | null;
  winner: string | null;
  reason: string | null;
  createdAt: Date;
  history: BattleEvent[]; // Added history field
  dispute?: Dispute; // Optional dispute field
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
  status: { type: String, enum: ["pending", "in-progress", "canceled", "completed", "disputed"], default: "pending" },
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
  dispute: {
    players: [{ type: String }],
    proofs: [{ player: String, filename: String, path: String }],
    resolved: { type: Boolean, default: false },
    winner: { type: String, default: null },
  },
});

export default mongoose.model<IBattle>("Battle", BattleSchema);
