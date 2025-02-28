import { Socket } from "socket.io";
import { io } from "../app";
import Battle from "../models/Battle";
import Profile from "../models/Profile"; // ✅ Import Profile model

const socketManager = (socket: Socket) => {
  console.log("A user connected:", socket.id);

  socket.on("error", (error) => {
    console.error(`🚨 WebSocket Error on ${socket.id}:`, error.message);
  });
  

// 🎮 Handle battle creation
socket.on("createBattle", async (battleData, callback) => {
  console.log("📥 Received createBattle event:", battleData);
  try {
    const { userId, amount, ludoCode, name } = battleData;

    if (!userId || !amount || !name) {
      return callback({ status: 400, message: "Invalid battle data||" });
    }

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

socket.on("updateBattleStatus", async ({ battleId, status }, callback) => {
  try {
    // ✅ Update the battle status
    const battle = await Battle.findById(
      battleId
    );

    if (!battle) {
      return callback({ status: 404, message: "Battle not found" });
    }

    const { player1, player2 } = battle;

    if (battle.status === "in-progress") {
      console.info(`📌 Checking pending battles for ${player1} or ${player2}...`);

      // ✅ Find all pending battles involving player1 or player2
      const pendingBattles = await Battle.find({
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
          await Profile.bulkWrite(refundOperations);
          console.info("✅ Refunds processed successfully.");
        } catch (err) {
          console.error("❌ Refund processing failed:", err);
        }

        try {
          // ✅ Delete pending battles AFTER refunds are processed
          const deleteResult = await Battle.deleteMany({ _id: { $in: pendingBattleIds } });
          console.info(`🗑️ Deleted ${deleteResult.deletedCount} pending battles.`);
        } catch (err) {
          console.error("❌ Error deleting pending battles:", err);
        }
      } else {
        console.info("✅ No pending battles to delete.");
      }
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

    const { player1, player2, amount } = battle;

    let refundMessage = "";

    // 🔄 Check if both players are present
    if (player1 && player2) {
      // ✅ Both players present - refund 50% to each
      await Profile.updateOne({ userId: player1 }, { $inc: { amount } });
      await Profile.updateOne({ userId: player2 }, { $inc: { amount } });
      refundMessage = `Both players refunded ${amount }`;
    } else if (player1) {
      // ✅ Only player1 present - full refund
      await Profile.updateOne({ userId: player1 }, { $inc: { amount } });
      refundMessage = `Player1 refunded full amount ${amount}`;
    } else if (player2) {
      // ✅ Only player2 present - full refund
      await Profile.updateOne({ userId: player2 }, { $inc: { amount } });
      refundMessage = `Player2 refunded full amount ${amount}`;
    }

    // 🗑️ Delete the battle
    await Battle.findByIdAndDelete(battleId);

    io.emit("battleDeleted", battleId);
    return callback({ status: 200, message: `Battle deleted successfully. ${refundMessage}` });

  } catch (error) {
    console.error("❌ Error deleting battle:", error);
    return callback({ status: 500, message: "Internal server error" });
  }
});

}

export default socketManager;
