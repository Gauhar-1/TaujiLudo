import { useEffect, useState } from "react";
import { BettingCard } from "./bettingCard"
import { useNavigate } from "react-router-dom"
import axios from "axios";

export const HomePage = (props : any)=>{
    const navigate = useNavigate();
    const [setClicked , setSetClicked ] = useState(false);
    const [amount, setAmount ] = useState(0);
    const [ludoCode, setLudoCode] = useState("");
    const [battleCreated, setBattleCreated] = useState(false);
    const [ opponentFound, setOppoentFound] = useState(true);
    const [ onGoingB , setOnGoingB ] = useState([{ _id : ""}]);

    const createBattle = async()=>{
        try{
            const response = await axios.post('http://localhost:3000/api/auth/battles/create', {
                name : props.name,
                userId : "677bb4306857a1cde8045c44",
                ludoCode,
                amount
            });
            console.log(response.data);
            setBattleCreated(true)
        }
        catch(err){
            console.log("Error :" + err);
        }
    }

    

    useEffect(()=>{
        
        const ongoingBattle = async()=>{
            try{

                const response = await axios.get('http://localhost:3000/api/auth/battles/pending');

                if(!response){
                    console.log("response: " + response);
                }

                setOnGoingB(response.data);

            }
            catch(err){
                console.error("error: "+ err);
            }
            }

            ongoingBattle();
    },[setOnGoingB])

    return (
        <div className="max-w-sm bg-gray-300 min-h-screen">
            <div className="flex flex-col pt-12">
                <div className="bg-gray-300 pb-16">
              {!battleCreated && <div>
               <div className="font-serif text-center pt-4">CREATE A BATTLE!</div>
                <div className=" flex gap-2 ml-12 pl-2 mx-4 py-2">
                <input type="text" placeholder="Amount" className="p-2 rounded-md" onChange={(e)=>{
                    const newValue = parseInt(e.target.value);
                    setAmount(newValue);
                }}/>
                {!setClicked && <button className="bg-green-600 w-16 rounded p-2 font-bold" onClick={()=>{
                    setSetClicked(true);
                }}>Set</button>}
                </div>
                {setClicked && <div className=" flex gap-2 justify-center mx-4 py-2">
                <input type="text" placeholder="Ludo King Code" className="p-2 rounded-md" onChange={(e)=>{
                    setLudoCode(e.target.value);
                }}/>
                <button className="bg-green-600 w-16 rounded p-2 font-bold" onClick={()=>{
                    createBattle();
                }}>Create</button>
                </div>}
               </div>}
               {battleCreated &&<div className="flex justify-center">
               <div className={`bg-red-300 mt-8 mb-4 py-2 text-center rounded-lg w-52 ${opponentFound ? "bg-green-400 text-white" : "bg-gray-500"}`} onClick={()=>{
                  if(opponentFound){
                    navigate("/battle");
                  }
               }}>{opponentFound? "Enter the Battle":"Waiting for Opponent"}</div>
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
                    {onGoingB.map((battle : any) => <BettingCard key={battle._id} battle={battle} name={props.name} setBattleId={props.setBattleId}></BettingCard>)}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}