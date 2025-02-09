import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext"


interface Battle {
    _id: string;
    player1Name: string;
    player2Name: string;
    player1: string;
    player2: string;
    amount: number;
    prize: number;
  }
  
  interface RunningBattleProps {
    battle: Battle;
  }

export const RunningBattle = ({ battle }: RunningBattleProps)=>{

    const { userId, setBattleId } = useUserContext();
    const navigate = useNavigate();

    return(
        <div key={battle._id} className="bg-white shadow-lg rounded-lg mx-4  my-1 p-4">
        <div className="flex justify-between">
            <div className="flex flex-col gap-2  justify-center ">
                <div className=" w-24 text-center font-serif">{battle.player1Name}</div>
                <div className="flex  gap-14  justify-between">
<div className="flex  gap-2">
<div className="font-mono text-xs text-purple-500">Entry:</div>
<div className="flex gap-2">
<img src="../../cash.png" alt="" className="size-5"/>
<div className="font-bold text-xs">{battle.amount}</div>
</div>
</div>

</div>
            </div>
                <div className="flex justify-center mt-1">
            <img src="../../vs.png" alt="" className="size-7 mt-1 "/>
                </div>
            <div className="flex flex-col  gap-2  justify-center">
                <div className="text-center w-24 font-serif">{battle.player2Name}</div>
                <div className="flex  gap-1">
<div className="font-mono text-xs text-purple-500">Price: 
    
</div>
<div className="flex gap-2">
<img src="../../cash.png" alt="" className="size-5"/>
<div className="font-bold text-xs">{battle.prize}</div>
</div>
</div>
            </div>
        </div>
       { (userId === battle.player1 || userId === battle.player2) ? <div className="flex justify-center">
        <button className="bg-green-600 text-xs py-1 px-2 text-white font-serif rounded-md" 
         onClick={()=>{
            setBattleId(battle._id);
            navigate('/battle')
         }}>View</button>
        </div> : ""}
    </div>
    )
}