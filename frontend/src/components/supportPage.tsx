import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/url";

export const SupportPage = ()=>{
 
    const [ phone, setPhone ] = useState("");

    useEffect(()=>{
        const handleInfoBar = async()=>{
          try{
            const response = await axios.get(`${API_URL}/api/auth/getAdmin`);
            if(!response.data){
              return console.log( "InfoBAr response not found ");
            }
            const { adminSetting } = response.data.admin[0];
            setPhone(adminSetting.phoneNumber);
          }
          catch(err){
            console.log("Error: "+ err);
          }
        }
    
        handleInfoBar();
      },[])
    

    return (
        <div className="bg-gray-200 max-w-sm min-h-screen flex flex-col justify-center p-8 ">
            <div className="mb-40 flex flex-col gap-4">
            <img src="../../contact_us.png" alt=""  className="h-64 "/>
            <div className="mt-4 flex flex-col gap-4">
                <div className="text-center bg-blue-500 p-2 rounded-lg ">Contact us</div>
                <div className="text-center bg-gray-500 text-white p-2 rounded-lg ">+91   {""+phone}</div>
            </div>
            </div>
        </div>
    )
}