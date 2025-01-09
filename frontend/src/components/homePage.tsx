import { useState } from "react";
import { BettingCard } from "./bettingCard"
import { useNavigate } from "react-router-dom"

export const HomePage = ()=>{
    const navigate = useNavigate();
    const [setClicked , setSetClicked ] = useState(false);
    return (
        <div className="max-w-sm bg-white">
            <div className="flex flex-col pt-12">
                <div className="bg-gray-300 pb-16">
                <div className="font-serif text-center pt-4">CREATE A BATTLE!</div>
                <div className=" flex gap-2 ml-12 pl-2 mx-4 py-2">
                <input type="text" placeholder="Amount" className="p-2 rounded-md"/>
                {!setClicked && <button className="bg-green-600 w-16 rounded p-2 font-bold" onClick={()=>{
                    setSetClicked(true);
                }}>Set</button>}
                </div>
                {setClicked && <div className=" flex gap-2 justify-center mx-4 py-2">
                <input type="text" placeholder="Ludo King Code" className="p-2 rounded-md"/>
                <button className="bg-green-600 w-16 rounded p-2 font-bold" onClick={()=>{
                    navigate('/battle')
                }}>Create</button>
                </div>}
                <div className="bg-white mt-2 h-2"></div>
                <div className="bg-gray-300 "> 
                    <div className="flex justify-between">
                     <div className="flex">
                        <img src="../../battleIcon.png" alt="" className="size-6 m-2"/>
                        <div className="m-2 font-semibold-">Open Battle</div>
                     </div>
                     <div className="flex" onClick={()=>{
                        navigate('/rules');
                     }}>
                        <div className="my-2 font-semibold-">Rules</div>
                        <img src="../../info.png" alt="" className="size-6 m-2"/>
                     </div>
                    </div>
                    <div className="flex flex-col gap-3">
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    <BettingCard></BettingCard>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}