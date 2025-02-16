import { Socket } from "socket.io";
import { io } from "../app";
import Battle from "../models/Battle";
import Profile from "../models/Profile"; // ✅ Import Profile model

const socketManager = (socket: Socket) => {
  console.log("A user connected:", socket.id);

  // 🎮 Handle battle creation
  socket.on("createBattle", async (battleData, callback) => {
    try {
      const { userId, amount, ludoCode, name } = battleData;

      if (!userId || !amount || !name) {
        return callback({ status: 400, message: "Invalid battle data" });
      }

      // ✅ Check if player already has 2 battles
      const playerBattles = await Battle.find({
        $or: [{ player1: userId }, { player2: userId }],
      status: { $in: ["pending", "in-progress"] }, // ✅ Only check active battles
      });

      if (playerBattles.length >= 2) {
        console.log("⚠️ Cannot create more than 2 battles");
        return callback({ status: 400, message: "You cannot create more than 2 battles" });
      }

      // ✅ Create a new battle
      const battle = new Battle({
        player1: userId,
        amount,
        ludoCode,
        player1Name: name,
        prize: amount + (amount - amount * 0.05),
        status: "pending",
      });

      await battle.save();

      // ✅ Update user profile with new battle
      await Profile.findByIdAndUpdate(
        userId,
        {
          $push: { battles: { battleId: battle._id, timestamp: battle.createdAt, status: "pending" } },
        },
        { new: true, upsert: true }
      );

      console.log("✅ Battle created:", battle._id);
      io.emit("battleCreated", battle);
      return callback({ status: 200, message: "Battle created successfully", battleData: battle });

    } catch (error) {
      console.error("❌ Error creating battle:", error);
      return callback({ status: 500, message: "Internal server error" });
    }
  });

  // 🗑️ Handle battle deletion
  socket.on("deleteBattle", async (battleId, callback) => {
    try {
      const battle = await Battle.findByIdAndDelete(battleId);
      if (!battle) {
        return callback({ status: 400, message: "Battle not found" });
      }

      io.emit("battleDeleted", battleId);
      return callback({ status: 200, message: "Battle deleted successfully" });

    } catch (error) {
      console.error("❌ Error deleting battle:", error);
      return callback({ status: 500, message: "Internal server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};

export default socketManager;
