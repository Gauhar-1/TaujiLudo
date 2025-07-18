import axios from "axios";
import { useState } from "react";
import { API_URL } from "../utils/url";

export const PaymentSettings = ()=>{
     const [selectedFile , setSelectedFile] = useState<File | null>(null);
     const [ UPI, setUPI ] = useState("");

     const handleUpload = async()=>{
        if (!selectedFile ) {
            alert("Please select a file to upload.");
            return;
          }
          const formData = new FormData();
          formData.append("image", selectedFile);

          try{const response = await axios.post(`${API_URL}/api/auth/QRSettings`, formData);
             if(!response.data){
                console.log("QR response not found")
             }
        }
        catch(err){
            console.log("Error: " + err);
        }
     }
     const handleUPI = async()=>{
        if(!UPI){
            return console.log("UPI not found");
        }

        try{
            const response = await axios.post(`${API_URL}/api/auth/UPISettings` , { UPI });
            if(!response.data){
                console.log("QR response not found");
             }
        }
        catch(err){
            console.log("Error: "+ err);
        }
     }

    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
                           <div className="text-3xl font-serif">Payment Settings</div>
                           <div>
            <div className="bg-white  rounded-md shadow-md pb-4">
                               <div className="bg-gray-100 rounded-t-md">
                                   <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">QR Settings</div>
                               </div>
                               <div className="px-4 flex gap-2">
                                <div className="border p-2 w-12 text-center">QR</div>
                                <input  type="file" id="fileInput" className="text-center shadow-md  rounded-lg px-2 py-2  w-52 border  bg-white  text-sm " onChange={(e)=>{
                    if(e.target.files)
                    setSelectedFile(e.target.files[0])
                }} />
                <button className="border p-2  bg-blue-700 rounded-lg text-white" onClick={handleUpload}>Done</button>
                               </div>
                           </div>
            <div className="bg-white  rounded-md shadow-md pb-4">
                               <div className="bg-gray-100 rounded-t-md">
                                   <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">UPI Settings</div>
                               </div>
                               <div className="px-4 flex">
                                <div className="border p-2 w-12 text-center">UPI</div>
                                <input type="text" className="border p-2" onChange={(e)=>{
                                    setUPI(e.target.value);
                                }}/>
                               <button className="border p-2 ml-4 bg-blue-700 rounded-lg text-white" onClick={handleUPI}>Done</button>
                               </div>
                           </div>
            </div>
                        </div>
    )
}