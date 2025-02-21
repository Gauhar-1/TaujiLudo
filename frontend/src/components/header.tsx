import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { SideBar } from "./sideBar";
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "../utils/url";

export const Header = ()=>{
  const [sidebarClicked , setSidebarClicked] = useState(false);
  const navigate = useNavigate();
  const { login,  phoneNumber, amount, setAmount } = useUserContext();

  
      useEffect(()=>{
          if ( !phoneNumber) {
            return console.log( 'All fields are required.' + " " + phoneNumber);
          }
          const updateAmount = async()=>{
            try{
              const  response = await axios.get(`${API_URL}/api/auth/update-Amount`, { params:{ phoneNumber } });
              if(response && response.data && response.data.success){
                console.log("Amount updated")
              }
              else{
                console.log("Failed to update Amount")
                console.log(response.data);
              }
              setAmount(response.data.profile.amount);
            }
            catch(err){
               console.log("Error" + err);
            }
      
            }
      
          if (amount > 0) { 
            updateAmount();
          }
        },[]);

   return (
    <div>

    <div className="fixed left-0 top-0 z-40 w-96 shadow-xl max-w-sm bg-white">
      { login && <div className=" flex flex-row justify-between ">
       <div className="flex flex-row p-2 gap-6">
         <div className="ml-2 pt-2" onClick={()=>{
              setSidebarClicked(true);
         }}> ☰</div>
           
           <img src="../../logo.png" alt=""  className="h-10 pt-" onClick={()=>{
            navigate('/winCash');
           }}/>
       </div>
       <div className="m-3 flex gap-2">
         <div className="bg-green-900 flex flex-row  rounded-md h-8 w-20">
         <img src="../../money.png" alt=""  className="h-5 m-1"/>
         <div className="text-xs text-white">cash  {amount}</div>
         <div className="bg-black" onClick={()=>{
          navigate('wallet');
         }}>
         <img src="../../plus sign.png" alt="" className="h-5 mt-1 p-1 "/>
         </div>
         </div>
         <div className="bg-green-900 flex flex-row gap-1 rounded-md h-8 w-20">
         <img src="../../moneyBag.png" alt=""  className="h-5 m-1" />
         <div className="text-xs  text-white " onClick={()=>{
          navigate('/referalEarning');
         }}>Earning :- 0</div>
         </div>
       </div>
   </div>}
       {!login && <div className="flex justify-center">
        <img src="../../logo.png" alt=""  className="h-14  "/>
       </div>}
        
    </div>
    {sidebarClicked && <SideBar setSidebarClicked={setSidebarClicked} />}
    </div>
   )
}