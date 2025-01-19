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

    const {battleId, userId,name } = req.body;

    if(!battleId || !name  || !userId){
        console.log("feilds Missing: " + name + " " + battleId + " " + userId);
    }
    
    const battle = await Battle.findByIdAndUpdate(battleId,
        {
            player2Name: name,
            player2 : userId,
            status: "in-progress",
            createdAt:  date
        });

    if(!battle){
        console.log("battle not found");
    }

    res.status(200).json(battle);

}

export const inProgressBattle = async( req: any, res: any, next: any)=>{

    const { battleId } = req.query;

    const battle = await Battle.findById(battleId);

    if(!battle){
        console.log("Battle not found");
    }

    res.status(200).json(battle);
}

export const uploadScreenShot = async(req: any, res: any, next: any)=>{

    const { battleId  }  = req.body;

    if(!battleId){
        console.log("battleId not found");
    }
    if(!req.file){
        console.log("file not found")
    }
 
    try {
        const battle = await Battle.findByIdAndUpdate(battleId ,{
          filename: req.file?.filename,
          path: req.file?.path,
          status : "completed",
        });

        if(!battle){
            console.log("battle is not found");
        }

        res.status(200).json({ message: 'Image uploaded successfully', battle });
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