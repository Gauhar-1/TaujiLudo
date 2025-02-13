import { useEffect, useState } from "react"
import { API_URL } from "../utils/url"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"

export const DisputeResult = ()=>{

    const { battleId , userId, setUserId, setBattleId} = useUserContext();
    const [ battle, setBattle ] = useState({
        _id: "",
        amount: 0,
        winner: "",
        filename: "",
        path: "",
        player1Name : "",
        player2Name : "",
        player1 : "",
        player2 : "",
        dispute : {
            players : [],
            resolved : false,
            proofs : [{
                filename: "",
                _id : {},
                player : ""
            }],
        }

    });
    const [ rejectClicked, setRejectClicked ] = useState(false);
    const [ viewClicked, setViewClicked ] = useState(false);
    const [ rejectClicked2, setRejectClicked2 ] = useState(false);
    const [ viewClicked2, setViewClicked2 ] = useState(false);
    const [ reason, setReason ] = useState("");

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

    const handleVerify = async()=>{
        try{
            if(battleId){
                console.log("Battle Id", battleId);
            }

            const response = await axios.post(`${API_URL}/api/auth/battles/disputeBattle/approve`,{ battleId, userId })

            if(!response.data){
                console.log("Response: "+response.data);
            }

        }
        catch(err){
            console.log("Error: "+ err);
        }
    }
    const handleReject = async()=>{
        try{
            if(userId){
                console.log("User Id",userId);
            }

            const response = await axios.post(`${API_URL}/api/auth/battles/disputeBattle/reject`,{userId, reason, battleId})

            if(response.data){
                console.log("Response: "+response.data);
            }

        }
        catch(err){
            console.log("Error: "+ err);
        }
    }


    
    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
                    <div className="text-3xl font-serif">Battle</div>
                    <div className="bg-white  rounded-md shadow-md pb-4">
                        <div className="bg-gray-100 rounded-t-md">
                            <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">View dispute</div>
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

                        <div className="bg-gray-300 my-6 h-2"></div>
                        
                        <div className="px-4">
                        <div className="flex">
                                <div className="p-2 w-28 border">Player1</div>
                                <div className="p-2 w-60 border">{battle.player1Name}</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">Phone </div>
                                <div className="p-2 w-60 border">{battle.dispute.players[0] }</div>
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
                                { battle.dispute.resolved && <div className="p-2 w-1/2 border bg-green-400 rounded-lg m-2" onClick={()=>{
                                    {battle.dispute.proofs[1].player === battle.player2 ? setUserId(battle.player2) : setUserId(battle.player1);
                                        setBattleId(battle._id);
                                        handleVerify();
                                }}}>Approve</div>}
                                <div className="p-2 w-1/2 border bg-red-400 rounded-lg m-2" onClick={()=>{
                                    setRejectClicked(true);
                                }}>Reject</div>
                            </div>}
                        </div>
                        { viewClicked && <div className="bg-gray-400 p-6 mx-6  rounded-lg">
                            <img src={`${API_URL}/uploads/${battle.dispute.proofs[1].player === battle.player1 ? battle.dispute.proofs[1].filename : battle.dispute.proofs[0].filename}`} alt="" className="rounded-lg" />
                        </div> }

                        <div className="bg-gray-300 my-6 h-2"></div>
                        <div className="px-4">
                        <div className="flex">
                                <div className="p-2 w-28 border">Player2</div>
                                <div className="p-2 w-60 border">{battle.player2Name}</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">Phone </div>
                                <div className="p-2 w-60 border">{battle.dispute.players[1] }</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">ScreenShot</div>
                                <div className="p-2 w-60 border">
                                    <div className="bg-green-300 w-11 p-1 rounded-md" onClick={()=>{
                                        if(viewClicked2){
                                            setViewClicked2(false);
                                        }
                                        else{
                                            setViewClicked2(true);
                                        }
                                    }}>{ viewClicked2? "back" : "view"}</div>
                                </div>
                            </div>
                           {!rejectClicked2 && <div className="flex text-center">
                                { battle.dispute.resolved && <div className="p-2 w-1/2 border bg-green-400 rounded-lg m-2" onClick={()=>{
                                    {battle.dispute.proofs[1].player === battle.player2 ? setUserId(battle.player2) : setUserId(battle.player1);
                                        setBattleId(battle._id);
                                        handleVerify();
                                }}}>Approve</div>}
                                <div className="p-2 w-1/2 border bg-red-400 rounded-lg m-2" onClick={()=>{
                                    setRejectClicked2(true);
                                }}>Reject</div>
                            </div>}
                        </div>
                        { viewClicked2 && <div className="bg-gray-400 p-6 mx-6  rounded-lg">
                            <img src={`${API_URL}/uploads/${battle.dispute.proofs[1].player === battle.player2 ? battle.dispute.proofs[1].filename : battle.dispute.proofs[0].filename}`} alt="" className="rounded-lg" />
                        </div> }
                    </div>
                    {rejectClicked && <div className="bg-gray-400 px-10 py-6 absolute top-60 shadow-md rounded-lg w-80 m-6">
                        <div className="pb-2 text-lg font-bold text-blue-600">{`Send to ${battle.player1Name}`}</div>
                        <textarea
        className="w-full border border-gray-300 p-2 rounded resize-none break-words whitespace-normal"
        rows={4}
        placeholder="Type your text here..."
        onChange={(e)=>{
            setReason(e.target.value);
        }}
      ></textarea>
                            <div className="bg-blue-500 text-center p-2 text-white font-bold mt-2 rounded-lg" onClick={()=>{
                                setRejectClicked2(false);
                                {battle.dispute.proofs[1].player === battle.player2 ? setUserId(battle.player2) : setUserId(battle.player1);
                                    setBattleId(battle._id);
                                    handleReject();
                            }}}>sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                 setRejectClicked2(false);
                                 }}>cancel</div>
                        </div>}
                    {rejectClicked2 && <div className="bg-gray-400 px-10 py-6 absolute top-60 shadow-md rounded-lg w-80 m-6">
                        <div className="pb-2 text-lg font-bold text-blue-600">{`Send to ${battle.player2Name}`}</div>
                        <textarea
        className="w-full border border-gray-300 p-2 rounded resize-none break-words whitespace-normal"
        rows={4}
        placeholder="Type your text here..."
      onChange={(e)=>{
        setReason(e.target.value);
      }}></textarea>
                            <div className="bg-blue-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                setRejectClicked2(false);
                                {battle.dispute.proofs[1].player === battle.player2 ? setUserId(battle.player2) : setUserId(battle.player1);
                                    setBattleId(battle._id);
                                    handleReject();
                            }}}>sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                setRejectClicked2(false);
                               
                            }}>cancel</div>
                        </div>}
                 </div>
    )
}