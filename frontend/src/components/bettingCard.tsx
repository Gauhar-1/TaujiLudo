import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { socket } from "./homePage";
import { useState } from "react";

export const BettingCard = (props : any)=>{
    // const navigate = useNavigate();
    const {  userId } = useUserContext();
    const [ history , setHistory ] = useState([{
        event : ""
    }]);

    const { setBattleId, name, event,setEvent, details, setDetails } = useUserContext();

    const joinBattle = async()=>{
        
        try{

           const respose = await axios.post(`${API_URL}/api/auth/battles/join`, {
                name ,
                userId ,
                battleId : props.battle._id,
                event,
                details
            });

            console.log(respose.data);
            setHistory(props.battle.history)
            // navigate('/battle');
        }
        catch(err){
            console.log("Error :" + err);
        }
    }
    const deleteBattle = () => {
        socket.emit("deleteBattle", props.battle._id);
        console.log("Battleid: "+ props.battle._id);
      };

      // Function to iterate over object properties
       function iterateHistory(event : string){
         Object.entries(history).forEach(([, value]) => {
            if(value.event === event){
                return true;
            }
    });
    return false;
  }

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
       <><button className={`text-center font-mono  text-white py-2 px-4 text-xs rounded-md ${ iterateHistory("opponent_found" ) ? "bg-purple-700" : "bg-gray-500"}`} onClick={() => {
                            setBattleId(props.battle._id);
                            if(props.battle.history.event === "opponent_found"){
                                setEvent("player_entered");
                                setDetails(`${props.battle.player2Name} joined the battle`);
                                joinBattle();
                            }
                        } }>{iterateHistory("opponent_found") ? "play" : "Waiting"}</button><button className="text-center font-mono bg-red-600 text-white py-2 px-4 text-xs rounded-md" onClick={() => {
                            deleteBattle();
                            setBattleId(props.battle._id);
                        } }>Delete</button></> : userId === props.battle.player2 ?
                        <><button className={`text-center font-mono  text-white py-2 px-4 text-xs rounded-md ${iterateHistory("opponent_found") ? "bg-purple-700" : "bg-gray-500"}`} onClick={() => {
                                             if(iterateHistory("player_entered")){
                                                 setBattleId(props.battle._id);
                                                 joinBattle();
                                             }
                                         } }>{iterateHistory("player_entered") ?  "Enter" :"Requested"}</button><button className="text-center font-mono bg-red-600 text-white py-2 px-4 text-xs rounded-md" onClick={() => {
                                             setBattleId(props.battle._id);
                                             setEvent("opponent_entered");
                                             setDetails(`${props.battle.player2Name} joined the battle`);
                                             joinBattle();
                                         } }>cancel</button></> : <button className={`text-center font-mono  text-white py-2 px-4 text-xs rounded-md bg-purple-700`} onClick={() => {
                                             setEvent("opponent_found");
                                             setDetails(`Opponent matched successfully`);
                                             setBattleId(props.battle._id);
                                             joinBattle();
                                         } }>play</button>}
       </div>
    </div>
        </div>
    )
}