import { useUserContext } from "../hooks/UserContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/url";


 export const MoneyRecharge = ()=>{
    const location =useLocation();
    const profile = location.state?.profile;
    const { setAmount , amount } = useUserContext();

    const handleDeposit = async () => {
        try {
             await axios.post(`${API_URL}/api/auth/deposit`, {
                userId : profile.userId, // Replace with the logged-in user's ID
                amount,
                wallet : (profile.amount + amount),
                paymentMethod: 'upi',
                upiId : "admin",
            });
            console.log('Deposit initiated. Complete the payment.');
            setAmount((profile.amount + amount));
        } catch (err : any) {
            console.log('Error initiating deposit: ' + err.response?.data?.message || err.message);
        }
    };
    return (
         <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-4 px-4">
            <div className="text-3xl font-serif">Recharge to User</div>
            <div className="bg-white  rounded-md shadow-md pb-4">
                <div className="bg-gray-100 rounded-t-md">
                    <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">Recharge Money</div>
                </div>
                
                <div>
                    <div className="p-4">
                        <div className="flex">
                            <div className="border border-black py-1 px-2 w-20">UserId</div>
                            <div className="border border-black py-1 px-2 w-60">{profile.userId}</div>
                        </div>
                        <div className="flex">
                            <div className="border border-black py-1 px-2 w-20">Phone Number</div>
                            <div className="border border-black py-1 px-2 w-60">{profile.phoneNumber}</div>
                        </div>
                        <div className="flex">
                            <div className="border border-black p-2 w-20">Amount</div>
                            <input type="text" placeholder="Add Amount" name="" id="" className="border border-black  p-2 w-60" onChange={(e)=>{
                                const newValue = parseInt(e.target.value);
                                setAmount(newValue);
                            }}/>
                        </div>
                            <div className="bg-blue-700 p-2 my-2 rounded-lg w-20 text-center text-white" onClick={()=>{
                                handleDeposit();
                            }}>Add</div>
                    </div>
                </div>

            </div>
         </div>
    )
 }