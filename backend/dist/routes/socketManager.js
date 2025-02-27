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
const app_1 = require("../app");
const Battle_1 = __importDefault(require("../models/Battle"));
const Profile_1 = __importDefault(require("../models/Profile")); // ✅ Import Profile model
const socketManager = (socket) => {
    console.log("A user connected:", socket.id);
    // 🎮 Handle battle creation
    socket.on("createBattle", (battleData, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, amount, ludoCode, name } = battleData;
            if (!userId || !amount || !name) {
                return callback({ status: 400, message: "Invalid battle data" });
            }
            // ✅ Check if the player has an "in-progress" battle
            const activeBattles = yield Battle_1.default.find({
                $or: [{ player1: userId }, { player2: userId }],
                status: { $in: ["pending", "in-progress"] }, // Only check active battles
            });
            // ✅ Prevent battle creation if any "in-progress" battle exists
            if (activeBattles.some((b) => b.status === "in-progress")) {
                console.log("⚠️ Cannot create a battle while another is in-progress");
                return callback({
                    status: 400,
                    message: "You have an ongoing battle. Finish it before creating a new one.",
                });
            }
            // ✅ Prevent duplicate "pending" battles with the same amount
            if (activeBattles.some((b) => b.status === "pending" && b.amount === amount)) {
                console.log("⚠️ Cannot create duplicate pending battle with the same amount.");
                return callback({
                    status: 400,
                    message: "You already have a pending battle with this amount.",
                });
            }
            if (activeBattles.length >= 2) {
                console.log("⚠️ Cannot create more than 2 battles");
                return callback({ status: 400, message: "You cannot create more than 2 battles" });
            }
            // ✅ Check user's profile & balance
            const userProfile = yield Profile_1.default.findOne({ userId });
            if (!userProfile) {
                return callback({ status: 404, message: "User profile not found" });
            }
            if (userProfile.amount < amount) {
                return callback({ status: 400, message: "Insufficient balance" });
            }
            userProfile.amount -= amount;
            yield userProfile.save();
            // ✅ Create a new battle
            const battle = new Battle_1.default({
                player1: userId,
                amount,
                ludoCode,
                player1Name: name,
                prize: amount + (amount - amount * 0.05),
                status: "pending",
            });
            yield battle.save();
            // ✅ Update user profile with new battle
            yield Profile_1.default.findByIdAndUpdate(userId, {
                $push: { battles: { battleId: battle._id, timestamp: battle.createdAt, status: "pending" } },
            }, { new: true, upsert: true });
            console.log("✅ Battle created:", battle._id);
            app_1.io.emit("battleCreated", battle);
            return callback({ status: 200, message: "Battle created successfully", battleData: battle });
        }
        catch (error) {
            console.error("❌ Error creating battle:", error);
            return callback({ status: 500, message: "Internal server error" });
        }
    }));
    socket.on("updateBattleStatus", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ battleId, status }, callback) {
        try {
            // ✅ Update the battle status
            const battle = yield Battle_1.default.findById(battleId);
            if (!battle) {
                return callback({ status: 404, message: "Battle not found" });
            }
            const { player1, player2 } = battle;
            if (battle.status === "in-progress") {
                console.info(`📌 Checking pending battles for ${player1} or ${player2}...`);
                // ✅ Find all pending battles involving player1 or player2
                const pendingBattles = yield Battle_1.default.find({
                    status: "pending",
                    $or: [{ player1 }, { player2 }, { player1: player2 }, { player2: player1 }],
                }).lean();
                if (pendingBattles.length > 0) {
                    console.info(`🛑 Found ${pendingBattles.length} pending battles. Processing refunds...`);
                    const pendingBattleIds = pendingBattles.map((b) => b._id);
                    // ✅ Refund players in the pending battles
                    const refundOperations = pendingBattles.flatMap((battle) => [
                        {
                            updateOne: {
                                filter: { userId: battle.player1 },
                                update: { $inc: { amount: battle.amount } },
                            },
                        },
                        {
                            updateOne: {
                                filter: { userId: battle.player2 },
                                update: { $inc: { amount: battle.amount } },
                            },
                        },
                    ]);
                    try {
                        yield Profile_1.default.bulkWrite(refundOperations);
                        console.info("✅ Refunds processed successfully.");
                    }
                    catch (err) {
                        console.error("❌ Refund processing failed:", err);
                    }
                    try {
                        // ✅ Delete pending battles AFTER refunds are processed
                        const deleteResult = yield Battle_1.default.deleteMany({ _id: { $in: pendingBattleIds } });
                        console.info(`🗑️ Deleted ${deleteResult.deletedCount} pending battles.`);
                    }
                    catch (err) {
                        console.error("❌ Error deleting pending battles:", err);
                    }
                }
                else {
                    console.info("✅ No pending battles to delete.");
                }
            }
            app_1.io.emit("battleUpdated", battle);
            return callback({ status: 200, message: "Battle status updated", battle });
        }
        catch (error) {
            console.error("❌ Error updating battle status:", error);
            return callback({ status: 500, message: "Internal server error" });
        }
    }));
    // 🗑️ Handle battle deletion
    socket.on("deleteBattle", (battleId, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 🔍 Find the battle before deleting to get necessary details
            const battle = yield Battle_1.default.findById(battleId);
            if (!battle) {
                return callback({ status: 400, message: "Battle not found" });
            }
            const { player1, player2, amount } = battle;
            let refundMessage = "";
            // 🔄 Check if both players are present
            if (player1 && player2) {
                // ✅ Both players present - refund 50% to each
                yield Profile_1.default.updateOne({ userId: player1 }, { $inc: { amount } });
                yield Profile_1.default.updateOne({ userId: player2 }, { $inc: { amount } });
                refundMessage = `Both players refunded ${amount}`;
            }
            else if (player1) {
                // ✅ Only player1 present - full refund
                yield Profile_1.default.updateOne({ userId: player1 }, { $inc: { amount } });
                refundMessage = `Player1 refunded full amount ${amount}`;
            }
            else if (player2) {
                // ✅ Only player2 present - full refund
                yield Profile_1.default.updateOne({ userId: player2 }, { $inc: { amount } });
                refundMessage = `Player2 refunded full amount ${amount}`;
            }
            // 🗑️ Delete the battle
            yield Battle_1.default.findByIdAndDelete(battleId);
            app_1.io.emit("battleDeleted", battleId);
            return callback({ status: 200, message: `Battle deleted successfully. ${refundMessage}` });
        }
        catch (error) {
            console.error("❌ Error deleting battle:", error);
            return callback({ status: 500, message: "Internal server error" });
        }
    }));
};
exports.default = socketManager;
