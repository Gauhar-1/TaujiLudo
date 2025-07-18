import { useEffect, useState } from "react";
import {   useNavigate } from "react-router-dom"
import { SideBar } from "./sideBar";
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "../utils/url";

export const Header = ()=>{
  const [sidebarClicked , setSidebarClicked] = useState(false);
  const [ earnings , setEarnings] = useState(false);
  const navigate = useNavigate();
  const { login,  phone, amount, setAmount, setUserId, setName, setPhone, setPhoneNumber, setLogin } = useUserContext();

  
  useEffect(() => {

    const checkAuth = async () => {
      if ( !login) {
        console.log("No auth cookie found, skipping auth check.");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });

        if (response.data.success) {
          const userData = response.data.user;
          setUserId(userData.userId);
          setName(userData.name);
          setPhoneNumber(userData.phoneNumber);
          setPhone(userData.phoneNumber);
          setLogin(true);
        }
      } catch (err : any) {
        console.error("User not logged in", err.response?.status);

        if (err.response?.status === 401) {
          console.log("Session expired, logging out...");
        }
      }
    };

    checkAuth();

    // Optional: Polling every 5 seconds for session expiry handling
    const interval = setInterval(checkAuth, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []); // Runs only once when the component mounts
    
  
      useEffect(()=>{
          if ( !phone) {
            return console.log( 'All fields are required.' + " " + phone);
          }
          const updateAmount = async()=>{
            try{
              const  response = await axios.get(`${API_URL}/api/auth/update-Amount`, { params:{ phoneNumber : phone }, withCredentials: true });
              if(response && response.data && response.data.success){
                console.log("Amount updated")
              }
              else{
                console.log("Failed to update Amount")
                console.log(response.data);
              }
              setAmount(response.data.profile.amount);
              setEarnings(response.data.profile.totalUserReferalEarning);
            }
            catch(err){
               console.log("Error" + err);
            }
      
            }
      
            updateAmount();
        },[]);

   return (
    <div>

    <div className="fixed left-0 top-0 z-40 w-96 shadow-xl max-w-sm bg-white">
      { login && <div className=" flex flex-row justify-between ">
       <div className="flex flex-row p-2 gap-6">
         <div className="ml-2 pt-2" onClick={()=>{
              setSidebarClicked(true);
         }}> ☰</div>
           
           <div  className=" h-10 overflow-hidden">
           <img src="../../logo.png"  className="h-9 mt-1 w-full  " onClick={()=>{
            navigate('/winCash');
           }}/>
           </div>
       </div>
       <div className="ml-3 my-3 mr-5 flex gap-2">
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
         }}>Earning :- {earnings || 0}</div>
         </div>
       </div>
   </div>}
       {!login && <div className="flex justify-between px-2">
        <img src="../../logo.png" alt=""  className="h-9 mt-2 "/>
        <div className="p-2">
          <div className="py-2 px-4 shadow-lg rounded-md  bg-purple-600 text-white ">Login</div>
        </div>
       </div>}
        
    </div>
    {sidebarClicked && <SideBar setSidebarClicked={setSidebarClicked} />}
    </div>
   )
}