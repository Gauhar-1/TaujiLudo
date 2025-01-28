import { useEffect, useState } from "react"
import { StickyTable } from "../utils/transactionTable"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"

export const TransactionHistory = ()=>{
    const [ username, setUserName ] = useState("");
    const [ phoneNumber, setPhoneNumber ] = useState("");
    const [ email, setEmail ] = useState("");

    const { userId } = useUserContext();
    
    useEffect(()=>{
        const handle = async()=>{
            if(userId){
                console.log("UserId: " + userId);
            }
            try{const response = await axios.get('http://localhost:3000/api/auth/findProfile', { params : { userId }});

            if(!response.data){
                 return console.log("response not found" , response.data);
            }
            console.log(response.data)

            const { name , phoneNumber , email } = response.data[0];


            setUserName(name);
            setPhoneNumber(phoneNumber || "N/A");
            setEmail(email  || "N/A");
            console.log("profile fetched successfully");
            }
            catch(err){
                console.log("Error: " + err);
            }
        }
        handle();
    },[userId])

    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
                   <div className="text-3xl font-serif pb-4">Transaction History</div>
                   <div className="bg-white  rounded-md shadow-md pb-4">
                    <div className="bg-gray-300 flex justify-center gap-2 p-6">
                        <div className="">
                            <img src="/Avatar.png" alt="" className="size-24"/>
                        </div>
                        <div className="flex flex-col gap-1 p-2" >
                            <div className="font-bold text-lg">{username}</div>
                            <div>{phoneNumber}</div>
                            <div>{email}</div>
                        </div>
                    </div>
                       <div className="bg-gray-100 rounded-t-md">
                           <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">Transction Details
                           </div>
                       </div>
                       <div className="px-1 pb-10">
                        <StickyTable></StickyTable>
                       </div>
                   </div>
                </div>
    )
}