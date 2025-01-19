import axios from "axios"
import { useEffect, useState } from "react"

export const GameHistory =( props : any)=>{

    const [ battles, setBattles ] = useState([{
        "_id": "",
        "player1Name": "",
        "player2Name": "",
        "player1": "",
        "player2": null,
        "amount": 0,
        "prize": 0,
        "screenShot": null,
        "status": "",
        "ludoCode": "",
        "winner": null,
        "createdAt": "",
        "__v": 0
    }]);

    const userId = props.userId;

    useEffect(()=>{
        const handleBattleHistory = async()=>{
           try{ const response = await axios.get("http://localhost:3000/api/auth/battles/battleHistory",{ params : { userId }});

            if(!response){
                console.log("response not found");
            }

            setBattles(response.data);}
            catch(err){
                console.log("error: " + err);
            }
        }

        handleBattleHistory();
    })

    return <div className="bg-white min-h-screen max-w-sm pt-12">
        {
            battles.map(battle => <div key={battle._id} className="bg-gray-200 rounded-lg mx-4  my-6 p-4">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2 px-3 pl-8 ">
                        <img src="../../profile.png" alt="" className="size-12" />
                        <div className=" w-24 font-serif">{battle.player1Name}</div>
                    </div>
                    <img src="../../vs.png" alt="" className="size-7 mt-10 "/>
                    <div className="flex flex-col  gap-2  ml-10 pl-5">
                        <img src="../../profile.png" alt="" className="size-12" />
                        <div className="text- w-24 font-serif">{battle.player2Name}</div>
                    </div>
                </div>
                <div className="flex justify-between">
                <div className="flex flex-col gap-2 pt-3 justify-center">
    <div className="flex  gap-2">
        <div className="font-mono text-sm text-purple-500">Status: </div>
        <div className="flex gap-2">
     <div className="font-bold text-xs">{battle.status}</div>
        </div>
    </div>
    <div className="flex  gap-1">
        <div className="font-mono text-sm text-purple-500">Winner:</div>
        <div className="flex gap-2">
     <div className="font-bold text-xs">{battle.winner}</div>
        </div>
    </div>
   </div>
   <div className="flex flex-col gap-2 pt-3 justify-center">
    <div className="flex  gap-2">
        <div className="font-mono text-sm text-purple-500">Entry:</div>
        <div className="flex gap-2">
    <img src="../../cash.png" alt="" className="size-6"/>
     <div className="font-bold text-xs">{battle.amount}</div>
        </div>
    </div>
    <div className="flex  gap-1">
        <div className="font-mono text-sm text-purple-500">Price: 
            
        </div>
        <div className="flex gap-2">
    <img src="../../cash.png" alt="" className="size-6"/>
     <div className="font-bold text-xs">{battle.prize}</div>
        </div>
    </div>
   </div>
                </div>
            </div>)
        }
    </div>
}