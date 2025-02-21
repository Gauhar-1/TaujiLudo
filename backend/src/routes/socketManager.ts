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

    // ✅ Check user's profile & balance
    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return callback({ status: 404, message: "User profile not found" });
    }

    if (userProfile.amount < amount) {
      return callback({ status: 400, message: "Insufficient balance" });
    }

    userProfile.amount -= amount;
    await userProfile.save();

    // ✅ Check if the player has an "in-progress" battle
    const activeBattles = await Battle.find({
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

  // 🎮 Handle battle status update (Auto-delete pending battles)
  socket.on("updateBattleStatus", async ({ battleId, status }, callback) => {
    try {
      // ✅ Update battle status
      const battle = await Battle.findByIdAndUpdate(
        battleId,
        { status },
        { new: true }
      );

      if (!battle) {
        return callback({ status: 404, message: "Battle not found" });
      }

      // ✅ If battle is now "in-progress", delete all "pending" battles for this player
      if (status === "in-progress") {
        await Battle.deleteMany({
          $or: [{ player1: battle.player1 }, { player2: battle.player2 }],
          status: "pending",
        });

        console.log(`⚠️ Deleted all pending battles for player ${battle.player1} and ${battle.player2}`);
      }

      io.emit("battleUpdated", battle);
      return callback({ status: 200, message: "Battle status updated", battle });

    } catch (error) {
      console.error("❌ Error updating battle status:", error);
      return callback({ status: 500, message: "Internal server error" });
    }
  });


  // 🗑️ Handle battle deletion
socket.on("deleteBattle", async (battleId, callback) => {
  try {
    // 🔍 Find the battle before deleting to get necessary details
    const battle = await Battle.findById(battleId);
    if (!battle) {
      return callback({ status: 400, message: "Battle not found" });
    }

    // ✅ Refund battle entry fee to player1 (since battle isn't completed)
    await Profile.findOneAndUpdate(
      { userId: battle.player1 },
      { $inc: { amount: battle.amount } }, // Refund the entry fee
      { new: true }
    );

    // 🗑️ Delete the battle
    await Battle.findByIdAndDelete(battleId);

    io.emit("battleDeleted", battleId);
    return callback({ status: 200, message: "Battle deleted successfully, entry fee refunded" });

  } catch (error) {
    console.error("❌ Error deleting battle:", error);
    return callback({ status: 500, message: "Internal server error" });
  }
});
}

export default socketManager;
