import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "../utils/url";

export const WalletPage = ()=>{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [ cashWon , setCashWon ] = useState(0)
    const [ token , setToken ] = useState(0)
    const { phone } = useUserContext();

    useEffect(() => {
        const fetchProfile = async () => {
          setIsLoading(true);
          if (!phone) {
            console.log("Phone number (Profile): "+ phone);
            return;
          }
    
          try {
            const response = await axios.get(
              `${API_URL}/api/auth/findProfile`,
               { params :{ phoneNumber : phone }} 
            );
    
            if (response.data) {
              const { cashWon, amount } = response.data[0];
              setCashWon(cashWon);
              setToken(amount);
              console.log("Profile fetched successfully.");
            } else {
              console.warn("Failed to fetch profile.");
            }
          } catch (err) {
            console.error("Error fetching profile:", err);
          }
          finally{
            setIsLoading(false);
          }
        };
    
        fetchProfile();
      }, []);

       if(isLoading){
      return (
        <div className="flex items-center h-screen w-full ">
        <div className="bg-gray-200 mx-10 bg-opacity-100 shadow-xl p-10 rounded-md flex flex-col gap-4">
               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
             </div>
        </div>
      )
    }

    return (
        <div className="bg-gray-300 min-h-screen max-w-sm pt-12 py-6 flex flex-col ">
            <div className="bg-white py-4 text-center rounded-md my-6 ml-8 w-80 flex justify-center gap-4 text-blue-600 " onClick={()=>{
                navigate('/history');
            }}>
                <img src="../../order-history.png" alt="" className="size-10"/>
                <div className="text-xl font-bold"> History</div>
                </div>
                <div className="">
                    <div className="bg-blue-600 rounded-md h-48 p-4 m-6 flex flex-col gap-10">
                        <div className="flex justify-between">
                            <div>
                            <div className="flex gap-2">
                         <img src="../../cash.png" alt="" className="size-8" />
                         <div className="text-white font-bold text-xl">{token}</div>
                            </div>
                    <div className="text-white font-serif"> Deposit Cash</div>
                            </div>
                            <div className="text-white  border p-3 rounded-md hover:cursor-pointer bg-blue-700"   onClick={()=>{
                                navigate('/deposit');
                            }}>Add Cash</div>
                        </div>
                        <div className="text-sm font-thin text-blue-300">Can be used to play Tournaments & Battles.
                        Cannot be withdrawn to Paytm or Bank.</div>
                    </div>
                    <div className="bg-blue-600 rounded-md h-48 p-4 m-6 flex flex-col gap-10">
                        <div className="flex justify-between">
                            <div>
                            <div className="flex gap-2">
                         <img src="../../cash.png" alt="" className="size-8" />
                         <div className="text-white font-bold text-xl">{cashWon}</div>
                            </div>
                    <div className="text-white font-serif"> Wining Cash</div>
                            </div>
                            <div className="text-white  border p-3 rounded-md bg-blue-700 hover:cursor-pointer" onClick={()=>{
                                navigate('/withdraw');
                            }}>Withdraw</div>
                        </div>
                        <div className="text-sm font-thin text-blue-300">Can be used to play Tournaments & Battles.
                        Cannot be withdrawn to Paytm or Bank.</div>
                    </div>
                </div>
                
        </div>
    )
}