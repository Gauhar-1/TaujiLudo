import { useEffect, useState } from "react"
import { API_URL } from "../utils/url"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"
import { useNavigate } from "react-router-dom"

export const PaymentRequest = ()=>{

    const { paymentId, setId, id } = useUserContext();
    const [ battle, setBattle ] = useState({
        _id : "",
        amount: 0,
        winner: "",
        filename: "",
        path: "",
        player1Name : "",
        player2Name : "",
        userId: "",
        date: "",
        type: "",
        details :"",
        paymentMethod: "",

    });
    const [ rejectClicked, setRejectClicked ] = useState(false);
    const [ viewClicked, setViewClicked ] = useState(false);
    const [ reason, setReason ] = useState("");
    const [ bank , setBank ] = useState({
        name : "",
        IFSC : "",
        accountNumber : ""
    });
    const navigate = useNavigate();

    useEffect(()=>{
        const handle = async()=>{
            try{
                const response = await axios.get(`${API_URL}/api/auth/findTransaction` , { params : { paymentId }});

            if(!response.data){
                return console.log("Response: "+ response.data);
            }

            setBattle(response.data);
            console.log("Filename: " + battle.filename);

            typeof battle.details === "string" ? setBank(response.data.details) : "";
            setId(response.data.userId);
            console.log("Battle : " + battle);
        }
            catch(err){
                 console.log("Error: " + err);
            }
        }

        handle();
    },[paymentId]);

    const handleVerify = async()=>{
        try{
            if(battle._id){
                console.log("Battle Id", battle._id);
            }

            const sanitizedTransactionId = battle._id.toString().replace(/:/g, "");

            console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);
    

            const response = await axios.post(`${API_URL}/api/auth/verify-payment`,{transactionId: sanitizedTransactionId, userId : id})

            if(response.data){
                console.log("Response: "+response.data);
            }

            navigate('/admin/reqPayments')
        }
        catch(err){
            console.log("Error: "+ err);
        }
    }
    const handleReject = async()=>{
        try{
            if(battle._id){
                console.log("Battle Id", battle._id);
            }

            const sanitizedTransactionId = battle._id.toString().replace(/:/g, "");

            console.log(`Sanitized Transaction ID: ${sanitizedTransactionId}`);
    

            const response = await axios.post(`${API_URL}/api/auth/reject-payment`,{transactionId: sanitizedTransactionId, reason , userId : id})

            if(response.data){
                console.log("Response: "+response.data);
            }

            navigate('/admin/reqPayments')
        }
        catch(err){
            console.log("Error: "+ err);
        }
    }

    const date = new Date(battle.date).toLocaleString();

    
    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-4 px-4">
                    <div className="text-3xl font-serif">Paymnet Request</div>
                    <div className="bg-white  rounded-md shadow-md pb-4">
                        <div className="bg-gray-100 rounded-t-md">
                            <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">Pending</div>
                        </div>
                        <div className="p-4">
                            <div className="py-2 font-bold text-gray-500">Payment Details</div>
                            <div className="flex">
                                <div className="p-2 w-24 border">Payment ID</div>
                                <div className="p-2 w-60 border">{paymentId}</div>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-24 border">User ID</div>
                                <div className="p-2 w-60 border">{battle.userId}</div>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-24 border">Type</div>
                                <div className="p-2 w-60 border">{battle.type}</div>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-24 border">Amount</div>
                                <div className="p-2 w-60 border">{battle.amount}</div>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-24 border">Date</div>
                                <div className="p-2 w-60 border">{date}</div>
                            </div>
                           
                        </div>
                        
                        <div className="p-4">
                        <div className="py-2 font-bold text-gray-500">{`${battle.
paymentMethod === "bank" ? "Bank" : "Upi" } Details`}</div>
                        { typeof battle.details === "string" ? <div className="flex">
                                <div className="p-2 w-28 border">UTR No.</div>
                                <div className="p-2 w-60 border">{typeof battle.details === "string" ? battle.details : "" }</div>
                            </div> : ""}
                        { typeof battle.details !== "string" ? <div className="flex">
                                <div className="p-2 w-28 border">Name</div>
                                <div className="p-2 w-60 border">{typeof battle.details !== "string" ? bank.name : "" }</div>
                            </div> : ""}
                        { typeof battle.details !== "string" ? <div className="flex">
                                <div className="p-2 w-28 border">IFSC</div>
                                <div className="p-2 w-60 border">{typeof battle.details !== "string" ?bank.IFSC : "" }</div>
                            </div> : ""}
                        { typeof battle.details !== "string" ? <div className="flex">
                                <div className="p-2 w-28 border">Account Number</div>
                                <div className="p-2 w-60 border">{typeof battle.details !== "string" ? bank.accountNumber : "" }</div>
                            </div> : ""}
                        {battle.type === "deposit" ? <div className="flex">
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
                            </div> : ""}
                           {!rejectClicked && <div className="flex text-center">
                                <div className="p-2 w-1/2 border bg-green-400 rounded-lg m-2" onClick={handleVerify}>Approve</div>
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
        placeholder="Type your text here..." onChange={(e)=>{
            setReason(e.target.value)
        }}
      ></textarea>
                            <div className="bg-blue-500 text-center p-2 text-white font-bold mt-2 rounded-lg" onClick={handleReject}>sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                setRejectClicked(false);
                            }}>cancel</div>
                        </div>}
                 </div>
    )
}