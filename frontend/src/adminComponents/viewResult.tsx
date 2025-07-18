import { useEffect, useState } from "react"
import { API_URL } from "../utils/url"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"
import { useNavigate } from "react-router-dom"

export const BattleResult = ()=>{

    const { battleId, id ,setId, setBattleId } = useUserContext();
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
    },[battleId]);

    const handleVerify = async()=>{
        try{
            if(battleId){
                console.log("Battle Id", battleId);
            }
            if(id){
                 console.log(`Id is not found ${id}`)
            }

            const response = await axios.post(`${API_URL}/api/auth/battles/disputeBattle/approve`, { battleId, userId : id })

            if(!response.data){
                console.log("Response: " + response.data);
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

            const response = await axios.post(`${API_URL}/api/auth/battles/disputeBattle/reject`, {userId : id, reason, battleId})

            if(!response.data){
                console.log("Response: "+response.data);
            }
        }
        catch(err){
            console.log("Error: "+ err);
        }
    }

    const checkPlayer = (clicked: string) => {
        if (!battle?.dispute?.proofs || battle.dispute.proofs.length === 0) {
            return "No proof available";
        }
    
        if (clicked === "image") {
            const winningProof = battle.dispute.proofs.find((proof) => proof.clicked === "Won");
            return winningProof?.filename || "No image available";
        } 
    
        if (clicked === "Reject") {
            const winningProof = battle.dispute.proofs.find((proof) => proof.clicked === "Won");
            return winningProof?.player || "No winner determined";
        }
    
        const proof = battle.dispute.proofs.find((proof) => proof.clicked === clicked);
        
        if (!proof) return "No winner determined";
    
        return proof.player === battle.player1 ? battle.player1Name : battle.player2Name;
    };
    
    
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
                                <div className="p-2 w-60 border">{checkPlayer("Won")}</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">Loser</div>
                                <div className="p-2 w-60 border">{checkPlayer("Lost")}</div>
                            </div>
                        <div className="flex">
                                <div className="p-2 w-28 border">Status</div>
                                <div className={`p-2 font-bold w-60 border ${battle.winner === "decided"? "text-green-400" : "text-red-500" }`}>{battle.winner === "decided"? "Approved" : "Pending" }</div>
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
                            {!rejectClicked && (
  <div className="flex text-center">
    <div
      className={`p-2 w-1/2 border rounded-lg text-white m-2 ${battle.winner ? "bg-gray-400 cursor-not-allowed" : "bg-green-400"}`}
      onClick={() => {
        if (!battle.winner) {
            setId(checkPlayer("Reject"));
          setBattleId(battle._id);
          handleVerify();
        }
      }}
    >
      Approve
    </div>
    
    <div
      className={`p-2 w-1/2 border rounded-lg text-white m-2 ${battle.winner ? "bg-gray-400 cursor-not-allowed" : "bg-red-400"}`}
      onClick={() => {
        if (!battle.winner) {
          setId(checkPlayer("Reject"));
          setRejectClicked(true);
        }
      }}
    >
      Reject
    </div>
  </div>
)}

                        </div>
                        { viewClicked && <div className="bg-gray-400 p-6 mx-6  rounded-lg">
                            <img src={`${API_URL}/uploads/${checkPlayer("image")}`} alt="" className="rounded-lg" />
                        </div> }
                    </div>
                    {rejectClicked && <div className="bg-gray-400 px-10 py-6 absolute top-56 rounded-md shadow-lg w-80 mx-6">
                       <div className="p-1 text-purple-700 font-bold">Send to {checkPlayer("Won")}</div>
                        <textarea
        className="w-full border border-gray-300 p-2 rounded resize-none break-words whitespace-normal"
        rows={4}
        placeholder="Type your text here..."
     onChange={(e)=>{
        setReason(e.target.value);
     }} ></textarea>
                            <div className="bg-blue-500 text-center p-2 text-white font-bold mt-2 rounded-lg" onClick={()=>{
                                setRejectClicked(false);
                                {
                                    setId(checkPlayer("Reject"))
                                    setBattleId(battle._id);
                                    handleReject();
                                    navigate('/admin/completeBattle')
                            }}}>sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                setRejectClicked(false);
                              }}>cancel</div>
                        </div>}
                 </div>
    )
}