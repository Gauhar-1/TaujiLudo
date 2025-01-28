// models/Battle.ts
import { url } from "inspector";
import mongoose, { Schema, Document } from "mongoose";
import { Url } from "twilio/lib/interfaces";

interface IBattle extends Document {
  player1Name: string;  
  player2Name: string;  
  player1: string; // Player 1's ID
  player2: string; // Player 2's ID
  amount: number;
  prize: number;
  filename : string;
  path : string;
  status: "pending" | "in-progress" |"canceled" | "completed";
  ludoCode: string;
  winner: string | null; // Winner ID
  reason: string | null;
  createdAt: Date;
}

const BattleSchema: Schema = new Schema({
  player1Name: { type: String, requuired: true },
  player2Name: { type: String, default: null }, 
  player1: { type: String, required: true },
  player2: { type: String, default: null  },
  amount: { type: Number, required: true},
  prize: { type: Number, required: true},
  filename: { type: String, default: null},
  path: { type: String, default: null},
  status: { type: String, enum: ["pending", "in-progress", "canceled", "completed"], default: "pending" },
  ludoCode: { type:String, default: null },
  winner: { type: String, default: null },
  reason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBattle>("Battle", BattleSchema);
