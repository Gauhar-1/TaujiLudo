import { useState } from "react";

export const AdminSettings = ()=>{
    const [ , setInfo ] = useState("");
    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-20 px-4">
        <div className="text-3xl font-serif">Admin Settings</div>
        <div>
<div className="bg-white  rounded-md shadow-md pb-4">
            <div className="bg-gray-100 rounded-t-md">
                <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">Support Settings</div>
            </div>
            <div className="px-4 flex">
             <div className="border p-2 w-20 text-xs text-center font-semibold">Phone Number</div>
             <input type="text" className="border p-2" />
            <button className="border p-2 ml-2 bg-blue-700 rounded-lg text-white">Done</button>
            </div>
        </div>
<div className="bg-white  rounded-md shadow-md pb-4">
            <div className="bg-gray-100 rounded-t-md">
                <div className=" font-semibold my-4 py-3 px-4 text-blue-700 border-b-2">Info Settings</div>
            </div>
            <div className="px-4 flex flex-col gap-2">
             <div className="border p-2 w-20 text-sm text-center font-semibold">Content</div>
             <textarea
        className="w-full border border-gray-300 p-2 rounded resize-none break-words whitespace-normal"
        rows={4}
        placeholder="Type your text here..." onChange={(e)=>{
            setInfo(e.target.value)
        }}
      ></textarea>
            <button className="border p-2  bg-blue-700 rounded-lg text-white ">Done</button>
            </div>
        </div>
</div>
     </div>
    )
}