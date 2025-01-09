import axios from "axios";
import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const LoginPage =(props : any)=>{
    const [sendOtp , setSendOtp] = useState(false);
    const [otp , setOtp] = useState("");
    const [phoneNumber , setPhoneNumber] = useState("");
    const navigate =useNavigate();


    const handleSendOtp = async()=>{
        
        await axios
        .post("http://localhost:3000/api/auth/send-otp", { phoneNumber})
        .then(response =>{
            console.log(response.data.success + "  this was response success")
            if(response.data.success){
                toast.success("OTP sent successfully");
            }
            else {
                toast.error("Invalid Phone Number");
            }
        })
        .catch(error =>{
            console.error(error);
            toast.error("Failed to send OTP");
        });
    };
    const handleVerifyOtp = ()=>{
        axios
        .post("http://localhost:3000/api/auth/verify-otp", { phoneNumber, otp})
        .then(response =>{
            if(response.data.success){
                toast.success("OTP verified successfully");
                navigate('/');
            }
            else {
                toast.error("Invalid OTP")
            }
        })
        .catch(error =>{
            console.error(error);
            toast.error("Error verifying OTP");
        })
    };

    return (
        <div  className="bg-gray-200 max-w-sm min-h-screen">   
            <div className="relative">
                <img src="../../logo.png" alt=""  className="size-48 absolute left-20 top-24 "/>
                <div className="bg-green-200 border absolute top-96 left-8 rounded-lg w-80 h-64 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-3xl font-serif pl-4 pt-4">Login Here!</div>
                        <div className="text-sm pl-4 font-thin">Fill in your information to complete your account.</div>
                    </div>
                    <div className="px-10 flex flex-col gap-4">
                        <div className="flex w-56">
                            <div className="bg-white border  p-1 border-r-indigo-400 rounded-l-md">+91</div>
                        <input type="text" className="bg-white p-1 rounded-r-md" placeholder="Enter the phone number" onChange={(e)=>{
                            setPhoneNumber(`+91${e.target.value}`);
                            props.setPhoneNumber(`+91${e.target.value}`);
                            }}/>
                        </div>
                        {sendOtp && <div className="flex w-56">
                            <div className="bg-white border  p-1 border-r-indigo-400 rounded-l-md font-bold">OTP</div>
                        <input type="text" className="bg-white p-1 rounded-r-md" placeholder="Enter the OTP" onChange={(e)=>{
                            setOtp(e.target.value)}}/>
                        </div>}
                        
                        <Link to='/login'>
                        <button className="bg-green-700 rounded-md w-56 text-center p-1" onClick={()=>{
                           if(!sendOtp){
                               setSendOtp(true);
                               handleSendOtp();
                           }
                           else{
                               props.setLogin(true);
                               handleVerifyOtp();
                           }
                        }} >{sendOtp ? "Verify OTP" : "Send OTP"}</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}