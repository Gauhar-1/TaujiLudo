import { Socket } from "socket.io";
import { io } from "../app";
import { Server } from "http";
import Battle from "../models/Battle";


const socketManager = (socket: Socket)=> {
    // Socket.IO integration

    // Handle battle creation
 socket.on("createBattle",async (battleData) => {
    if(battleData){
        console.log("BattleDta: "+ battleData.amount, battleData.ludoCode);
    }
    try {
     const battle = new Battle({ 
             player1 : battleData.userId,
              amount : battleData.amount,
              player1Name : battleData.name,
              prize: battleData.amount + (battleData.amount-(battleData.amount*0.05)),
              status: "pending" 
             });
         await battle.save();
      io.emit("battleCreated", battle); // Notify all connected clients
    } catch (error) {
      console.error("Error creating battle:", error);
    }
  });
 
 // Handle battle deletion
 socket.on("deleteBattle", async (battleId) => {
    try {
      await Battle.findByIdAndDelete(battleId);
      io.emit("battleDeleted", battleId); // Notify all connected clients
    } catch (error) {
      console.error("Error deleting battle:", error);
    }
  });

 socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
}


export default socketManager;