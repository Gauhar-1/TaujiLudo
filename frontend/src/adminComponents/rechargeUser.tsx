import { useState } from "react";
import { StickyTable } from "../utils/rechargeTable"
import { useUserContext } from "../hooks/UserContext";


 export const RechargeUser = ()=>{
    const { setUserId  } = useUserContext();
    const [ searchClicked , setSearchClicked ] = useState(false);
    return (
         <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
            <div className="text-3xl font-serif">Recharge to User</div>
            <div className="bg-white  rounded-md shadow-md pb-4">
                <div className="bg-gray-100 rounded-t-md">
                    <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">Recharge Money</div>
                </div>
                <div className="px-6  flex flex-col gap-2">
                    <div className="text-gray-400">Search Player :</div>
                    <input type="text" placeholder="Name , Phone Number, userId" className="border border-black rounded-md px-2 py-1" onChange={(e)=>{
                        setUserId(e.target.value);
                    }}/>
                    <div className="bg-gray-400 p-1 rounded-lg text-center w-32 text-white" onClick={()=>{
                        setSearchClicked(true);
                    }}>search</div>
                </div>
               { searchClicked ?  <div className="px-1 pb-10">
                    <StickyTable />
                </div> : ""}
                <div>
                   
                </div>

            </div>
         </div>
    )
 }