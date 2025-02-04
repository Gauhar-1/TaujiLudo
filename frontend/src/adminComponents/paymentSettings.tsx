import { useState } from "react";

export const PaymentSettings = ()=>{
     const [, setSelectedFile] = useState<File | null>(null);
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
                <button className="border p-2  bg-blue-700 rounded-lg text-white">Done</button>
                               </div>
                           </div>
            <div className="bg-white  rounded-md shadow-md pb-4">
                               <div className="bg-gray-100 rounded-t-md">
                                   <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">UPI Settings</div>
                               </div>
                               <div className="px-4 flex">
                                <div className="border p-2 w-12 text-center">UPI</div>
                                <input type="text" className="border p-2" />
                               <button className="border p-2 ml-4 bg-blue-700 rounded-lg text-white">Done</button>
                               </div>
                           </div>
            </div>
                        </div>
    )
}