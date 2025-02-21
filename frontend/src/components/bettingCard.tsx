import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { socket } from "./homePage";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const BettingCard = (props : any)=>{
    // const navigate = useNavigate();
    const {  userId } = useUserContext();

    const { setBattleId, name  } = useUserContext();

    const navigate = useNavigate();
    const joinBattle = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/auth/battles/join`, {
          name,
          userId,
          battleId: props.battle._id,
        });
    
        if (!response.data) {
          toast.error("No response from server. Please try again.");
          return;
        }
    
        toast.success("Successfully joined the battle! 🎉");
        // navigate('/battle'); // Uncomment if needed
    
      } catch (err: any) {
        console.error("Error:", err);
    
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.message || "Something went wrong.";
    
          if (status === 400) {
            toast.warn(message);
          } else if (status === 404) {
            toast.error("Battle not found.");
          } else {
            toast.error("Failed to join the battle. Please try again.");
          }
        } else {
          toast.error("Network error. Please check your connection.");
        }
      }
    };
    

    const deleteBattle = () => {
        socket.emit("deleteBattle", props.battle._id);
        console.log("Battleid: "+ props.battle._id);
      };

      const manageRequest = async(event: string, details: string)=>{
        try{
            const response = await axios.post(`${API_URL}/api/auth/battles/manageRequest`, {
                event,
                details,
                battleId :props.battle._id,
                userId
            });

            if(!response.data){
                console.log("Response not found");
            }

        }
        catch(err){
            console.log("Error: "+err);
        }
      }

   // Function to check if any object in `history` has the specified event
   function iterateHistory(history: { event: string }[], event: string): boolean {
    return history.some(entry => entry.event === event);
  }
  

   // Store computed values for history events
   const hasOpponentFound = iterateHistory(props.battle.history, "opponent_found");
   const hasPlayerEntered = iterateHistory(props.battle.history, "player_entered");
  
    return ( 
        <div>
    <div className="border-black bg-white rounded-t-md mx-2 my-1 p-2 text-sm">
       <div>Challenge from {props.battle.player1Name}</div>
    </div>
    <div className="border-black bg-white rounded-b-md mx-2 p-2 text-sm flex justify-between">
       <div className="flex gap-10">
        <div className="flex flex-col gap-1">
            <div className="font-serif text-purple-500">ENTRY</div>
            <div className="flex gap-2">
        <img src="../../cash.png" alt="" className="size-6"/>
         <div className="font-bold text-xs">{props.battle.amount}</div>
            </div>
        </div>
        <div className="flex flex-col gap-1">
            <div className="font-serif text-purple-500">PRICE</div>
            <div className="flex gap-2">
        <img src="../../cash.png" alt="" className="size-6"/>
         <div className="font-bold text-xs">{props.battle.prize}</div>
            </div>
        </div>
       </div>
       <div className="flex gap-3">
       
       {userId === props.battle.player1 ?
       <><button className={`text-center font-mono  text-white py-2 px-4 text-xs rounded-md ${ hasOpponentFound ? "bg-purple-700" : "bg-gray-500"}`} onClick={() => {
                            setBattleId(props.battle._id);
                            if(hasOpponentFound){
                                manageRequest("player_entered",`${props.battle.player1Name} joined the battle`);
                                navigate('/battle');
                            }
                        } }>{hasOpponentFound ? "play" : "Waiting"}</button><button className="text-center font-mono bg-red-600 text-white py-2 px-4 text-xs rounded-md" onClick={() => {
                            setBattleId(props.battle._id);
                            deleteBattle();
                        } }>Delete</button></> : userId === props.battle.player2 && hasOpponentFound ?
                        <><button className={`text-center font-mono  text-white py-2 px-4 text-xs rounded-md ${hasPlayerEntered ? "bg-purple-700" : "bg-gray-500"}`} onClick={() => {
                                             if(hasPlayerEntered){
                                                setBattleId(props.battle._id);
                                                 manageRequest("opponent_entered", `${props.battle.player2Name} joined the battle` );
                                                 console.log("Managing Request done")
                                                 navigate('/battle');
                                             }
                                         } }>{hasPlayerEntered ?  "Enter" :"Requested"}</button><button className="text-center font-mono bg-red-600 text-white py-2 px-4 text-xs rounded-md" onClick={() => {
                                             setBattleId(props.battle._id);
                                             manageRequest("opponent_canceled", `Opponent left the battle`);
                                         } }>cancel</button></> : <button className={`text-center font-mono  text-white py-2 px-4 text-xs rounded-md bg-purple-700`} onClick={() => {
                                             setBattleId(props.battle._id);
                                             joinBattle();
                                             manageRequest("opponent_found" , `Opponent matched successfully`);
                                         } }>play</button>}
       </div>
    </div>
        </div>
    )
}