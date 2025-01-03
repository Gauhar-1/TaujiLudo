import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage =(props : any)=>{
    const [sendOtp , setSendOtp] = useState(false);
    const navigate =useNavigate();
    return (
        <div  className="bg-gray-200  max-w-sm min-h-screen">   
            <div className="relative">
                <img src="../../logo.png" alt=""  className="size-48 absolute left-20 top-24 "/>
                <div className="bg-green-200 border absolute top-96 left-8 rounded-lg w-80 h-64 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl font-serif pl-4 pt-4">Login Here!</div>
                        <div className="text-sm pl-4 font-thin">Fill in your information to complete your account.</div>
                    </div>
                    <div className="px-10 flex flex-col gap-4">
                        <div className="flex">
                            <div className="bg-white border  p-1 border-r-indigo-400 rounded-l-md">+91</div>
                        <input type="text" className="bg-white p-1 rounded-r-md" placeholder="Enter the phone number"/>
                        </div>
                        {sendOtp && <div className="flex">
                            <div className="bg-white border  p-1 border-r-indigo-400 rounded-l-md font-bold">OTP</div>
                        <input type="text" className="bg-white p-1 rounded-r-md" placeholder="Enter the OTP"/>
                        </div>}
                        
                        <button className="bg-green-700 rounded-md w-56 text-center p-1" onClick={()=>{
                           if(!sendOtp){
                               setSendOtp(true);
                           }
                           else{
                               props.setLogin(true);
                                navigate('/');
                           }
                        }} >{sendOtp ? "Verify OTP" : "Send OTP"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}