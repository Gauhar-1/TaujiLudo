import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const BettingCard = (props : any)=>{
    const navigate = useNavigate();

    const joinBattle = async()=>{
        try{

           const respose = await axios.post('http://localhost:3000/api/auth/battles/join', {
                name : props.name,
                userId : "677bb4306857a1cde8045c44",
                battleId : props.battle._id
            });

            console.log(respose.data);
            navigate('/battle');
        }
        catch(err){
            console.log("Error :" + err);
        }
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
       <button className="text-center font-mono bg-purple-700 text-white py-2 px-4 text-xs rounded-md" onClick={()=>{
        joinBattle();
        props.setBattleId(props.battle._id);
       }}>Play</button>
    </div>
        </div>
    )
}