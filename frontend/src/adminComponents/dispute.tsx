import { useEffect, useState } from "react"
import { API_URL } from "../utils/url"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"
import { socket } from "../components/homePage"
import { useNavigate } from "react-router-dom"

export const DisputeResult = ()=>{

    const { battleId , id, setId, setBattleId} = useUserContext();
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
        status : "",
        dispute : {
            players : [],
            resolved : false,
            winner : "",
            proofs : [{
                filename: "",
                _id : {},
                player : "",
                clicked : ""
            }],
        },
        reason: ""

    });
    const [ rejectClicked, setRejectClicked ] = useState(false);
    const [ viewClicked, setViewClicked ] = useState(false);
    const [ rejectClicked2, setRejectClicked2 ] = useState(false);
    const [ viewClicked2, setViewClicked2 ] = useState(false);
    const [ reason, setReason ] = useState("");
    const navigate = useNavigate();

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

          // Polling every 5 seconds
    const interval = setInterval(handle, 5000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
    },[battleId])

    const handleVerify = async()=>{
        try{
            if(battleId){
                console.log("Battle Id", battleId);
            }

            const response = await axios.post(`${API_URL}/api/auth/battles/disputeBattle/approve`,{ battleId, userId : id })

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
            if(id){
                console.log("User Id",id);
            }

            const response = await axios.post(`${API_URL}/api/auth/battles/disputeBattle/reject`,{userId : id, reason, battleId})

            if(!response.data){
                console.log("Response: "+response.data);
            }
        }
        catch(err){
            console.log("Error: "+ err);
        }
    }

    const deleteBattle = () => {
        socket.emit("deleteBattle", battle._id);
        console.log("Battleid: "+ battle._id);
      };
    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
                    <div className="text-3xl font-serif">Battle</div>
                    <div className="bg-white  rounded-md shadow-md pb-4">
                        <div className="bg-gray-100 rounded-t-md">
                            <div className="flex justify-between font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">
                                <div>View dispute</div>
                            <button className="text-center font-mono bg-red-600 text-white py-2 px-4 text-xs rounded-md" onClick={() => {
                            setBattleId(battle._id);
                            deleteBattle();
                            navigate('/admin/disputeBattle')
                        } }>Delete</button>
                            </div>
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
             <div className="p-2 w-28 border">Clicked </div>
             <div className="p-2 w-60 border">
            {battle.dispute.proofs.find((proof)=>{ proof.player === battle.player1})?.clicked  }
        </div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">status </div>
                                { battle.dispute.winner &&<div className="p-2 w-60 border">{battle.dispute.winner === battle.player1 ? "winner" : "loser" }</div>}
                            </div>
                       { (battle.dispute.proofs[0].player === battle.player1 ? battle.dispute.proofs[0].clicked === "Won" : battle.dispute.proofs[1].clicked === "Won") && <div className="flex">
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
                            </div>}
                           {!rejectClicked && <div className="flex text-center">
                                {  <div className={`p-2 w-1/2 border text-white rounded-lg m-2 ${battle.winner ? "bg-gray-400 cursor-not-allowed" :  "bg-green-400"}`} onClick={()=>{
                                    {setId( battle.player1);
                                        setBattleId(battle._id);
                                        handleVerify();
                                        navigate('/admin/disputeBattle')
                                }}}>Approve</div>}
                                <div className={`p-2 w-1/2 border text-white rounded-lg m-2 ${battle.winner ? "bg-gray-400 cursor-not-allowed" :  "bg-red-400"}`} onClick={()=>{
                                    setRejectClicked(true);
                                }}>Reject</div>
                            </div>}
                        </div>
                        { viewClicked  && <div className="bg-gray-400 p-6 mx-6  rounded-lg">
                            <img src={`${API_URL}/uploads/${battle.dispute.proofs.find((proof)=>{proof.clicked === "Won"})?.filename  && battle.dispute.proofs.find((proof)=>{proof.clicked === "Won"})?._id as String === battle.player1}`} alt="" className="rounded-lg" />
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
             <div className="p-2 w-28 border">Clicked </div>
             <div className="p-2 w-60 border">
            {battle.dispute.proofs.find((proof)=>{proof.clicked})?.clicked  && battle.dispute.proofs.find((proof)=>{proof.clicked})?._id as String === battle.player2 }
        </div>
                            </div>
                            
                            <div className="flex">
                                <div className="p-2 w-28 border">status </div>
                                { battle.dispute.winner &&<div className="p-2 w-60 border">{battle.dispute.winner === battle.player2 ? "winner" : "loser" }</div>}
                            </div>
                        { ( battle.dispute.proofs[0].player === battle.player2 ? battle.dispute.proofs[0].clicked === "Won" : battle.dispute.proofs[1].clicked === "Won") &&<div className="flex">
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
                            </div>}
                           {!rejectClicked2 && <div className="flex text-center">
                                {  <div className={`p-2 w-1/2 border text-white rounded-lg m-2 ${battle.winner ? "bg-gray-400 cursor-not-allowed" :  "bg-green-400"}`} onClick={()=>{
                                    {setId(battle.player2);
                                        setBattleId(battle._id);
                                        handleVerify();
                                }}}>Approve</div>}
                                <div className={`p-2 w-1/2 border bg-red-400 text-white rounded-lg m-2 ${battle.winner ? "bg-gray-400 cursor-not-allowed" : "bg-red-400"}`} onClick={()=>{
                                    setRejectClicked2(true);
                                }}>Reject</div>
                            </div>}
                        </div>
                        { viewClicked2 && <div className="bg-gray-400 p-6 mx-6  rounded-lg">
                            <img src={`${API_URL}/uploads/${battle.dispute.proofs.find((proof)=>{proof.clicked === "Won"})?.filename  && battle.dispute.proofs.find((proof)=>{proof.clicked === "Won"})?._id as String === battle.player2}`} alt="" className="rounded-lg" />
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
                                setRejectClicked(false);
                                { setId(battle.player1);
                                    setBattleId(battle._id);
                                    handleReject();
                            }}}>sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                 setRejectClicked(false);
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
                                {   setId(battle.player2);
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