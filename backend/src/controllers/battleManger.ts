import { de } from "@faker-js/faker/.";
import { io } from "../app";
import Battle from "../models/Battle";
import Profile from "../models/Profile";
import mongoose from "mongoose";

const date =  new Date()
export const createBattle = async (
  battleData: { userId: any; amount: any; ludoCode: any; name: any },
  callback: any
) => {
  try {
    const { userId, amount, ludoCode, name } = battleData;

    // ✅ Fetch only active (pending/in-progress) battles of the player
    const activeBattles = await Battle.find({
      $or: [{ player1: userId }, { player2: userId }],
      status: { $in: ["pending", "in-progress"] }, // ✅ Only check active battles
    });

    // ✅ If user already has 2 active battles, block new creation
    if (activeBattles.length >= 2) {
      console.log("⚠️ Cannot create more than 2 active battles");
      return callback({
        status: 400,
        message: "You already have 2 active battles. Finish or leave one to create a new one.",
        battleData: null,
      });
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

    console.log("🔍 Saving battle:", battle);

    await battle.save();
    

    // ✅ Ensure battle is not duplicated in profile
    try {
      const updatedProfile = await Profile.findByIdAndUpdate(
        userId,
        {
          $push: { battles: { battleId: battle._id, timestamp: battle.createdAt, status: "pending" } },
        },
        { new: true, upsert: true }
      );

      console.log("✅ Profile updated:", updatedProfile);
    } catch (profileError: any) {
      console.error("❌ Error updating profile:", profileError.stack);
    }

    io.emit("battleCreated", battle);
    console.log("✅ New battle created:", battle._id);

    return callback({ status: 200, message: "Battle created successfully", battleData: battle });

  } catch (error: any) {
    console.error("❌ Error creating battle:", error.stack);
    return callback({ status: 500, message: "Internal server error", battleData: null });
  }
};

  


export const pendingBattle = async(req: any , res: any, next: any)=>{

    try{

    const status  = "pending";
    const battle = await Battle.find({status}).sort({ createdAt : -1});

    if(!battle){
        console.log("No Ongoing Battles");
    }

 
    res.status(200).json(battle);
    }
    catch(err){
        console.log("Error Found: " + err);
    }
}

export const showBattles = async(req: any, res: any, next: any)=>{
    try{

        const { status }  = req.query;

        if(status === "canceled"){

            const battle = await Battle.find({status ,  winner: { $exists: true, $ne: null } }).sort({ createdAt : -1});
    
            if(!battle){
                console.log("No  Battle found");
            }
        
         
            res.status(200).json(battle);
        }
        else{
            const battle = await Battle.find({status}).sort({ createdAt : -1});
    
            if(!battle){
                console.log("No  Battle found");
            }
        
         
            res.status(200).json(battle);
        }
       
        }
        catch(err){
            console.log("Error Found: " + err);
        }
}

export const battleHistory = async (req: any, res: any, next: any) => {
    try {
        const { userId } = req.query;

        // 🔵 First, search for battles where the user is `player1`
        let battle = await Battle.find({ player1: userId }).sort({ createdAt: -1 });

        // 🔵 If no battles are found, check `player2`
        if (battle.length === 0) {
            console.log("player1 not found, checking player2...");

            battle = await Battle.find({ player2: userId }).sort({ createdAt: -1 });
        }

        // 🔴 If still no battles found, return 404
        if (battle.length === 0) {
            return res.status(404).json({ message: "No battle history found for this user." });
        }

        // ✅ Return battles if found
        return res.status(200).json(battle);
    } catch (err : any) {
        console.error("Error:", err);
        return res.status(500).json({ error: err.message });
    }
};


export const joinBattle= async(req: any, res: any, next: any)=>{

    const {battleId, userId,name} = req.body;

    if(!battleId || !name  || !userId){
        console.log("feilds Missing: " + name + " " + battleId + " " + userId );
    }

    // if(event === "opponent_canceled "){
    //     const battle = await Battle.findByIdAndUpdate(battleId,
    //         { $set: { history: {} } } // Set profile to an empty object
    //     );

    //     if(!battle){
    //         console.log("battle not found");
    //     }
    
    //     return res.status(200).json(battle);
    // }
    
    const battle = await Battle.findByIdAndUpdate(battleId,
        {
            player2Name: name,
            player2 : userId,
            // status: "in-progress",
            createdAt:  date,
            // $push: { history: { event, timestamp: new Date(), details } },
        });

    if(!battle){
        console.log("battle not found");
    }

    res.status(200).json(battle);

}

export const manageRequest = async (req: any, res: any) => {
  try {
    const { battleId, event, details, userId } = req.body;

    if (!event || !details) {
      console.log("⚠️ Fields Missing: " + event + " " + details);
      return res.status(400).json({ message: "Missing event or details" });
    }

    let battle;

    if (event === "opponent_canceled") {
      battle = await Battle.findByIdAndUpdate(
        battleId,
        { $set: { history: {} } }, // Reset history
        { new: true }
      );

      if (!battle) {
        console.log("⚠️ Battle not found");
        return res.status(404).json({ message: "Battle not found" });
      }

      return res.status(200).json(battle);
    } 
    else if (event === "opponent_entered") {
      battle = await Battle.findByIdAndUpdate(
        battleId,
        {
          status: "in-progress",
          $push: { history: { event, timestamp: new Date(), details } },
        },
        { new: true }
      );

      if (!battle) {
        console.log("⚠️ Battle not found");
        return res.status(404).json({ message: "Battle not found" });
      }

      return res.status(200).json(battle);
    }

    // ✅ Push event to battle history
    battle = await Battle.findByIdAndUpdate(
      battleId,
      { $push: { history: { event, timestamp: new Date(), details } } },
      { new: true }
    );

    if (!battle) {
      console.log("⚠️ Battle not found");
      return res.status(404).json({ message: "Battle not found" });
    }

    // ✅ Fetch active battles of the player
    const playerBattles = await Battle.find({
      $or: [{ player1: userId }, { player2: userId }],
    }).sort({ createdAt: 1 });

    if (playerBattles.length === 2) {
      // ✅ Identify "pending" and "in-progress" battles
      const inProgressBattle = playerBattles.find((b) => b.status === "in-progress");
      const pendingBattle = playerBattles.find((b) => b.status === "pending");

      if (inProgressBattle && pendingBattle) {
          await Battle.findByIdAndDelete(pendingBattle._id);
          console.log(`⚠️ Pending battle ${pendingBattle._id} deleted (opponent found)`);

      }
    }

    return res.status(200).json(battle);
  } catch (error) {
    console.error("❌ Error in manageRequest:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleLudoCode = async(req: any, res: any)=>{
    const { battleId , ludoCode, event, details } = req.body;

    if(!battleId || !ludoCode){
        res.status(400).json("feilds Missing: " + battleId + " " + ludoCode);
    }

    const battle = await Battle.findByIdAndUpdate( battleId, {
        ludoCode,
        $push: { history: { event, timestamp: new Date(), details } },
    });

    if(!battle){
        res.status(400).json("Battle not found");
    }

    res.status(200).json("Ludo code set successfully");
}

export const inProgressBattle = async (req: any, res: any, next: any) => {
    try {
      const { battleId } = req.query;
  
      // Check if battleId is provided
      if (!battleId) {
        return res.status(400).json({ message: "battleId is required" });
      }
  
      // Find the battle using the battleId
      const battle = await Battle.findById(battleId);
  
      // Check if battle is found
      if (!battle) {
        return res.status(404).json({ message: "Battle not found" });
      }
  
      // Send the battle details as a response
      res.status(200).json(battle);
  
    } catch (err) {
      // Send a generic error message if an unexpected error occurs
      console.error("Error fetching battle:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const uploadScreenShot = async (req: any, res: any, next: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { battleId, playerId, phoneNumber } = req.body;

        if (!battleId) return res.status(400).json({ error: "battleId is required" });
        if (!req.file) return res.status(400).json({ error: "File is required" });

        const battle = await Battle.findById(battleId).session(session);
        if (!battle) return res.status(404).json({ error: "Battle not found" });

        if (![battle.player1, battle.player2].includes(playerId)) {
            return res.status(403).json({ error: "You are not part of this battle" });
        }

        console.log(`🖼️ Uploading Screenshot for Battle ${battleId} by ${playerId}`);

        // Initialize dispute if missing
        if (!battle.dispute) {
            battle.dispute = {
                players: [phoneNumber],
                proofs: [{ player: playerId, filename: req.file.filename, path: req.file.path, reason: "", clicked: "Won" }],
                resolved: false,
                winner: null,
                timestamp: new Date(),
            };
        } else {
            const alreadyUploaded = battle.dispute.proofs.some(proof => proof.player === playerId);
            if (alreadyUploaded) {
                return res.status(400).json({ error: "You have already uploaded a screenshot" });
            }

            battle.dispute.players = [...new Set([...battle.dispute.players, phoneNumber])]; // Prevent duplicates
            battle.dispute.proofs.push({ player: playerId, filename: req.file.filename, path: req.file.path, reason: "", clicked: "Won" });
        }

        await battle.save({ session });

        // ✅ Check if both players have clicked
        const player1Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player1);
        const player2Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player2);

        // ✅ Update status only after adding proofs
        if (player1Clicked && player2Clicked) {
            let status =  await updateBattleStatus(battle); // Await the status update

            if (status === "completed") {
                const winnerProfile = await Profile.findOne({ phoneNumber }).session(session);

                if (!winnerProfile) {
                  return res.status(400).json({ error: "Player profile not found" });
              }
                    winnerProfile.gameWon += 1;
                    await winnerProfile.save({ session });

                const loserId = playerId === battle.player1 ? battle.player2 : battle.player1;
                const loserProfile = await Profile.findOne({userId: loserId}).session(session);

                if (!loserProfile) {
                  return res.status(400).json({ error: "Player profile not found" });
              }

                    loserProfile.gameLost += 1;
                    await loserProfile.save({ session });

                // Process referral earnings
                if (winnerProfile.referredBy) {
                    const referredByProfile = await Profile.findOne({ phoneNumber: winnerProfile.referredBy }).session(session);
                    if (referredByProfile) {
                        const referral = referredByProfile.referrals.find(ref => ref.phoneNumber === winnerProfile.phoneNumber);
                        if (referral) {
                            referral.referalEarning += Number(battle.amount * 0.02);
                            await referredByProfile.save({ session });
                        }
                    }
                }
            }
        }

        await session.commitTransaction();
        session.endSession();

        console.log(`✅ Screenshot uploaded & battle status updated: ${battle.status}`);
        res.status(200).json({ message: "Screenshot uploaded successfully", battle });

    } catch (err) {
        await session.abortTransaction(); // Rollback changes if there's an error
        session.endSession();
        console.error("❌ Error in uploadScreenShot:", err);
        next(err);
    }
};

  

  export const battleLost = async (req: any, res: any, next: any) => {
    try {
        const { battleId, userId } = req.body;

        if (!battleId) return res.status(400).json({ error: "battleId is required" });
        if (!userId) return res.status(400).json({ error: "UserId is required" });

        const battle = await Battle.findById(battleId);
        if (!battle) return res.status(404).json({ error: "Battle not found" });

        if (!battle.dispute) {
            battle.dispute = {
                players: [userId],
                proofs: [{ player: userId, filename: "", path: "", reason: "", clicked: "Lost" }],
                resolved: false,
                winner: null,
                timestamp: new Date(),
            };
        } else {
            // Ensure player doesn't declare lost twice
            const alreadyLost = battle.dispute.proofs.some(proof => proof.player === userId && proof.clicked === "Lost");
            if (alreadyLost) return res.status(400).json({ error: "You have already marked yourself as lost" });

            battle.dispute.players = [...new Set([...battle.dispute.players, userId])]; // Ensure uniqueness
            battle.dispute.proofs.push({ player: userId, filename: "", path: "", reason: "", clicked: "Lost" });
        }

        await battle.save();

        // ✅ Check if both players have clicked
        const player1Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player1);
        const player2Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player2);

        // ✅ Update status only after adding proofs
        if (player1Clicked && player2Clicked) {
            let status = await updateBattleStatus(battle);

            if (status === "completed") {
                const winnerId = userId === battle.player1 ? battle.player2 : battle.player1;

                const winnerProfile = await Profile.findOne({userId: winnerId});
                if (!winnerProfile) {
                  return res.status(400).json({ error: "Player profile not found" });
              }
                    winnerProfile.gameWon += 1;
                    await winnerProfile.save();



                const loserProfile = await Profile.findOne({userId});

                if (!loserProfile) {
                  return res.status(400).json({ error: "Player profile not found" });
              }
                    loserProfile.gameLost += 1;
                    await loserProfile.save();

                // Process referral earnings
                if (winnerProfile.referredBy) {
                    const referredByProfile = await Profile.findOne({ phoneNumber: winnerProfile.referredBy });
                    if (referredByProfile) {
                        const referral = referredByProfile.referrals.find(ref => ref.phoneNumber === winnerProfile.phoneNumber);
                        if (referral) {
                            referral.referalEarning += Number(battle.amount * 0.02);
                            await referredByProfile.save();
                        }
                    }
                }
            }
        }

        res.json({ message: "Loser assigned successfully", battle });

    } catch (err) {
        console.error("❌ Error in battleLost:", err);
        next(err);
    }
};


export const canceledBattle = async (req: any, res: any, next: any) => {
  try {
    const { reason, battleId, userId, phoneNumber } = req.body;

    if (!battleId) return res.status(400).json({ error: "battleId is required" });
    if (!reason) return res.status(400).json({ error: "Reason is required" });

    const battle = await Battle.findById(battleId);
    if (!battle) return res.status(404).json({ error: "Battle not found" });

    console.log(`🚨 Player ${userId} requested battle cancelation for ${battleId}`);

    if (!battle.dispute) {
      battle.dispute = {
        players: [phoneNumber],
        proofs: [{ player: userId, filename: "", path: "", reason, clicked: "Canceled" }],
        resolved: false,
        winner: null,
        timestamp: new Date(),
      };
    } else {
      const alreadyCanceled = battle.dispute.proofs.some(proof => proof.player === userId && proof.clicked === "Canceled");
      if (alreadyCanceled) return res.status(400).json({ error: "You have already canceled the battle" });

      battle.dispute.players.push(phoneNumber);
      battle.dispute.proofs.push({ player: userId, filename: "", path: "", reason, clicked: "Canceled" });
    }
    await battle.save();

     // ✅ Check if both players have clicked
     const player1Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player1);
     const player2Clicked = battle.dispute.proofs.some(proof => proof.player === battle.player2);
     
     // ✅ Update status only after adding proofs
     if (player1Clicked && player2Clicked) {
        await updateBattleStatus(battle); // Update status only when both clicked
     }
    

    console.log(`✅ Battle cancelation recorded & status updated ${battle.status}`);
    res.status(200).json({ message: "Battle canceled successfully", battle });

  } catch (err) {
    console.error("❌ Error in canceledBattle:", err);
    next(err);
  }
};


const updateBattleStatus = async (battle: any) => {
  const player1Action = battle.player1 
      ? battle.dispute?.proofs.find((proof: { player: any }) => proof.player === battle.player1)?.clicked || "None" 
      : "None";

  const player2Action = battle.player2 
      ? battle.dispute?.proofs.find((proof: { player: any }) => proof.player === battle.player2)?.clicked || "None" 
      : "None";

  const statusMap: { [key: string]: string } = {
      "Won-Canceled": "disputed",
      "Lost-Canceled": "disputed",
      "Canceled-Lost": "disputed",
      "Lost-Lost": "disputed",
      "Canceled-Canceled": "canceled",
      "Won-Lost": "completed",
      "Lost-Won": "completed",
      "Canceled-Won": "disputed",
  };

  const statusKey = `${player1Action}-${player2Action}`;
  battle.status = statusMap[statusKey] || "disputed";

  await battle.save(); // ✅ Save changes to the database
  console.log(`🏆 Battle ${battle._id} status updated to: ${battle.status}`);

  return battle.status; // Return updated status for further logic
};


export const completeBattle = async(req: any, res: any)=>{
    const { winner, screenShot , id} = req.body;
    const battle = await Battle.findByIdAndUpdate(id, {
        screenShot,
        status : "completed",
        winner,
        date
    });

    if(!battle){
        console.log("Battle not completed");
    }
    res.status(200).json(battle);
}

export const runningBattle = async(req: any, res: any)=>{
    const battle = await Battle.find({ $or: [{ status: "pending" }, { status: "in-progress" }],}).sort({ createdAt : -1});

    if(!battle){
        console.log("Battle not found");
    }

    res.status(200).json(battle);
}
export const disputeBattle = async(req: any, res: any)=>{
    const battle = await Battle.find({ status: "disputed" }).sort({ createdAt : -1});

    if(!battle){
        console.log("Battle not found");
    }

    res.status(200).json(battle);
}

export const deleteBattle = async(req: any, res: any, next: any)=>{

    const { battleId } = req.body;

    const battle = await Battle.findByIdAndDelete(battleId);

    res.status(200).json(battle);
}

export const  determineWinner = async (req: any ,res : any) => {
    const { battleId , userId } = req.body;
  
    if (!battleId) {
        return res.status(400).json({ success: false, message: "BattleID is required." });
    }
  
    try {
  
        const battle = await Battle.findById(battleId);
  
        if (!battle) {
            console.log('Battle not found');
            return res.status(404).json({ success: false, message: 'Battle not found' });
        }
  
        if(battle.dispute){
            battle.dispute.winner = userId;
            battle.dispute.resolved = true;
            battle.status = "completed";
            battle.winner = "decided";
        }
        await battle.save();

        const playerProfile = await Profile.findById(userId);

        if(playerProfile){
          playerProfile.gameWon += 1;
          await playerProfile.save();
        }

        const loserId = userId === battle.player1 ? battle.player2 : battle.player1;


        const loserProfile = await Profile.findById(loserId);

        if(loserProfile){
          loserProfile.gameLost += 1;
          await loserProfile.save();
        }

        const referedBy = playerProfile?.referredBy;

        if(referedBy){
          const referedByProfile = await Profile.findOne({ phoneNumber : referedBy });
  
          if(referedByProfile){
          } // Find the referral by phone number
          const referral = referedByProfile?.referrals.find((ref) => ref.phoneNumber === referedBy);
      
          if (referral) {
            // Update the referral earning
            referral.referalEarning += Number(battle.amount * 0.02);
        
            // Save the updated profile
            await referedByProfile?.save();
          }
      
        }
         
  
        res.status(200).json({ success: true, message: 'Winner determined successfully', battle });
    } catch (err : any) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Winner determination failed', error: err.message });
    }
  }
  
  export const  rejectDispute = async (req: any ,res : any) => {
    const { userId , battleId , reason } = req.body;
  
    if (!battleId) {
        return res.status(400).json({ success: false, message: "Battle ID is required." });
    }
    if (!reason ) {
        return res.status(400).json({ success: false, message: "reason is required." });
    }
  
    try {
        // Find the transaction by payment reference
        const battle = await Battle.findById(battleId);
  
        if (!battle) {
            console.log('Profile not found');
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
  
        if(battle.dispute){
            battle.dispute.proofs[0].player === userId ?
            battle.dispute.proofs[0].reason = reason : battle.dispute.proofs[1].reason = reason;
            battle.dispute.timestamp = new Date();
        }
        await battle.save();
  
        // Update notification as transaction completed
      //   const notification = await Notification.findOneAndUpdate({paymentReference : transaction.paymentReference}, 
      //  { status:'failed', reason});
  
        // if (!notification) {
        //     console.log('notification not found');
        //     return res.status(404).json({ success: false, message: 'notification  not found' });
        // }
  
        res.status(200).json({ success: true, message: 'Kyc Rejected and notification sent', battle });
    } catch (err : any) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Kyc rejection failed', error: err.message });
    }
  }