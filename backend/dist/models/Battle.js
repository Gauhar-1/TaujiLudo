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
const BattleSchema = new mongoose_1.Schema({
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
    loser: { type: String, default: null },
    reason: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    // ✅ Event history tracking
    history: [
        {
            event: { type: String, enum: ["opponent_found", "player_entered", "opponent_entered", "opponent_canceled", "ludoCode_set"] },
            timestamp: { type: Date, default: Date.now },
            details: { type: String },
        },
    ],
    dispute: {
        players: [{ type: String }],
        proofs: [{ player: String, filename: String, path: String, reason: String, adminReason: String, clicked: String }],
        resolved: { type: Boolean, default: false },
        winner: { type: String, default: null },
        timestamp: { type: Date, default: Date.now },
    },
});
exports.default = mongoose_1.default.model("Battle", BattleSchema);
