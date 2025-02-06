import { useEffect, useState } from "react"
import { API_URL } from "../utils/url"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"

export const BattleResult = ()=>{

    const { battleId } = useUserContext();
    const [ battle, setBattle ] = useState({
        amount: 0,
        winner: "",
        filename: "",
        path: "",
        player1Name : "",
        player2Name : "",

    });
    const [ rejectClicked, setRejectClicked ] = useState(false);
    const [ viewClicked, setViewClicked ] = useState(false);

    useEffect(()=>{
        const handle = async()=>{
            try{
                const response = await axios.get(`${API_URL}/api/auth/battles/inBattle` , { params : { battleId }});

            if(!response.data){
                return console.log("Response: "+ response.data);
            }

            setBattle(response.data);
            console.log("Battle : " + battle);
        }
            catch(err){
                 console.log("Error: " + err);
            }
        }

        handle();
    },[battleId])

    
    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
                    <div className="text-3xl font-serif">Battle</div>
                    <div className="bg-white  rounded-md shadow-md pb-4">
                        <div className="bg-gray-100 rounded-t-md">
                            <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">View Result</div>
                        </div>
                        <div className="p-4">
                            <div className="flex">
                                <div className="p-2 w-24 border">Battle ID</div>
                                <div className="p-2 w-60 border">{battleId}</div>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-24 border">Entry fee</div>
                                <div className="p-2 w-60 border">{battle.amount}</div>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-24 border">Prize</div>
                                <div className="p-2 w-60 border">{Math.floor((2*battle.amount) -(battle.amount * 0.05))}</div>
                            </div>
                        </div>
                        
                        <div className="p-4">
                        <div className="flex">
                                <div className="p-2 w-28 border">Winner</div>
                                <div className="p-2 w-60 border">{battle.winner}</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">Loser</div>
                                <div className="p-2 w-60 border">{battle.winner === battle.player1Name ? battle.player2Name : battle.player1Name }</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">ScreenShot</div>
                                <div className="p-2 w-60 border">
                                    <div className="bg-green-300 w-11 p-1 rounded-md" onClick={()=>{
                                        if(viewClicked){
                                            setViewClicked(false);
                                        }
                                        else{
                                            setViewClicked(true);
                                        }
                                    }}>{ viewClicked ? "back" : "view"}</div>
                                </div>
                            </div>
                           {!rejectClicked && <div className="flex text-center">
                                <div className="p-2 w-1/2 border bg-green-400 rounded-lg m-2">Approve</div>
                                <div className="p-2 w-1/2 border bg-red-400 rounded-lg m-2" onClick={()=>{
                                    setRejectClicked(true);
                                }}>Reject</div>
                            </div>}
                        </div>
                        { viewClicked && <div className="bg-gray-400 p-6 mx-6  rounded-lg">
                            <img src={`${API_URL}/uploads/${battle.filename}`} alt="" className="rounded-lg" />
                        </div> }
                    </div>
                    {rejectClicked && <div className="bg-gray-400 p-10 absolute w-80 m-6">
                        <textarea
        className="w-full border border-gray-300 p-2 rounded resize-none break-words whitespace-normal"
        rows={4}
        placeholder="Type your text here..."
      ></textarea>
                            <div className="bg-blue-500 text-center p-2 text-white font-bold mt-2 rounded-lg">sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                setRejectClicked(false);
                            }}>cancel</div>
                        </div>}
                 </div>
    )
}