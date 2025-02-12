import { de } from "@faker-js/faker/.";
import { io } from "../app";
import Battle from "../models/Battle";

const date =  Date.now()
export const createBattle = async(req: any, res: any, next: any)=>{

    const { userId, amount, ludoCode, name } = req.body;
    const battle = new Battle({ 
        player1 : userId,
         amount,
         ludoCode,
         player1Name : name,
         prize: amount + (amount-(amount*0.05)),
         status: "pending" 
        });
    await battle.save();
    io.emit("battleCreated", battle);
    if(!battle){
        console.log("battle not created");
    }
    res.status(201).json(battle);  

}

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

export const battleHistory = async( req : any, res: any, next: any )=>{

    try{
        const { userId } = req.query;

        const battle = await Battle.find( { player1 : userId }).sort({ createdAt : -1 });
        
        if(!battle){
            console.log("player1 is not found");
            
            const battle = await Battle.find({ player2 : userId }).sort({ createdAt : -1 });
            
            if(!battle){
                console.log(" No Battle found ");
            }
            
            res.status(200).json(battle);

            return;
        }
        
        res.status(200).json(battle);
    }
    catch(err){
        console.log("error: " +err);
    }
}

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

export const manageRequest = async(req: any, res: any)=>{
    const { battleId,event, details } = req.body;

    if(!event || !details){
        console.log("feilds Missing: " + event + " " + details  );
    }

    if(event === "opponent_canceled"){
        const battle = await Battle.findByIdAndUpdate(battleId,
            { $set: { history: {} } } // Set profile to an empty object
        );

        if(!battle){
            console.log("battle not found");
        }
    
        return res.status(200).json(battle);
    }
    else if(event === "opponent_entered"){
        const battle = await Battle.findByIdAndUpdate(battleId,
            {  status: "in-progress",
               $push: { history: { event, timestamp: new Date(), details } },
             } 
        );

        if(!battle){
            console.log("battle not found");
        }
    
        return res.status(200).json(battle);
    }

    const battle = await Battle.findByIdAndUpdate(battleId,
        {
            $push: { history: { event, timestamp: new Date(), details } },
        });

    if(!battle){
        console.log("battle not found");
    }

    res.status(200).json(battle);
}

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
  

export const uploadScreenShot = async(req: any, res: any, next: any)=>{

    try {
        const { battleId, playerId } = req.body;
    
        if (!battleId) {
          return res.status(400).json({ error: "battleId is required" });
        }
    
        if (!req.file) {
          return res.status(400).json({ error: "File is required" });
        }
    
        const battle = await Battle.findById(battleId);
        if (!battle) {
          return res.status(404).json({ error: "Battle not found" });
        }
    
        // Ensure player is part of the battle
        if (![battle.player1, battle.player2].includes(playerId as string)) {
          return res.status(403).json({ error: "You are not part of this battle" });
        }
    
        // Store the proof and handle disputes
        if (!battle.dispute) {
          battle.dispute = {
            players: [playerId],
            proofs: [{ player: playerId as string, filename: req.file.filename, path: req.file.path }],
            resolved: false,
            winner: null,
          };
        } else {
          // Prevent duplicate uploads by the same player
          const alreadyUploaded = battle.dispute.proofs.some(proof => proof.player === playerId);
          if (alreadyUploaded) {
            return res.status(400).json({ error: "You have already uploaded a screenshot" });
          }
    
          battle.dispute.players.push(playerId);
          battle.dispute.proofs.push({ player: playerId, filename: req.file.filename, path: req.file.path });
    
          // If both players upload screenshots, mark as disputed
          if (battle.dispute.players.length > 1) {
            battle.status = "disputed";
          }
        }
    
        await battle.save();
        res.status(200).json({ message: "Screenshot uploaded successfully", battle });
      } catch (err) {
        console.log("error: " + err);
        res.status(500).json({ error: 'Failed to upload image' });
      }
}

export const canceledBattle = async( req: any, res: any, next: any)=>{

    const { reason , battleId } = req.body;

    if(!battleId){
       console.log("BattleId not found");
    }
    if(!reason){
        console.log("reason not found");
    }

   try{ const battle = await Battle.findByIdAndUpdate( battleId, {
        reason,
        status : "canceled",
        
    } )

    if(!battle){
        console.log("battle not found");
    }

    res.status(200).json(battle);}
    catch(err){
        console.log("error: " + err);
    }
}

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