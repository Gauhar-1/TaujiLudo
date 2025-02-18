import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";

export const  WithdrawToBank = ()=>{
   const [token, setToken] = useState(0);
   const [name ,setName] = useState("");
   const [IFSC ,setIFSCcode] = useState("");
   const [accountNumber , setAccountNumber] = useState("");
   const [message, setMessage] = useState("");
   const [balanceLess, setBalanceLess] = useState(false);
   const { userId,amount, phoneNumber } = useUserContext();


   const handleWithdraw = async () => {
      try {
         await axios.post(`${API_URL}/api/auth/withdraw`, {
              userId,
              phoneNumber,
              amount : token,
              wallet : amount - token,
              paymentMethod: 'bank',
              destinationDetails : {
                 name,
                 IFSC,
                 accountNumber, // Replace with actual details
              }
          });
          console.log('Withdrawal request submitted.');
          navigate('/wallet');
      } catch (err: any) {
         if (err.response) {
             console.log("Error Response:", err.response.data);
             setMessage(err.response.data.message);
             setBalanceLess(true);
         } else {
             console.log("Error in withdrawal:", err);
         }
     }
  };

    const navigate = useNavigate();
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm ">
            <div className=" relative ">
                <div className="absolute top-20 rounded-md bg-gray-300 m-6 ">
                <div className="p-4 w-80 text-center font-serif text-2xl">Withdrawal To Bank</div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Account Holder's Name:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1" onChange={(e)=>{
                     setName(e.target.value);
                    }}/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Account Number:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1" onChange={(e)=>{
                     setAccountNumber(e.target.value);
                    }}/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">IFSC Code:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1" onChange={(e)=>{
                     setIFSCcode(e.target.value);
                    }}/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Amount to Withdraw:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1" onChange={(e)=>{
                     const newValue = parseInt(e.target.value);
                     setToken(newValue);
                    }}/>
                 </div>
                 <div className="p-2 flex justify-center">
                 <div className=" bg-green-500 h-10 w-64 rounded-md text-center pt-2 mb-2" onClick={handleWithdraw}>Withdraw</div>
                 </div>
                 <div className="flex justify-center">
                 <div className="bg-green-700 w-28 text-center rounded-md p-1 mb-8" onClick={()=>{
                    navigate('/withdraw')
                 }}>back</div>
                 </div>
                </div>
            </div>
            {  balanceLess &&<div className="absolute top-60 bg-gray-200 mx-10 shadow-xl p-10 rounded-md flex flex-col gap-4">
                <div className=" border-2 border-gray-500  p-2 font-serif text-lg rounded-md text-purple-700">{message}</div>
                <div className="bg-blue-500 text-white p-2 text-center rounded-lg" onClick={()=>{
                    setBalanceLess(false);
                }}>Ok</div>
             </div>}
        </div>
    )
}