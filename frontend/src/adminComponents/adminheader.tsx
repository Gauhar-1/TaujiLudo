import { useState } from "react";
import { AdminSideBar } from "./adminSideBar";
// import { SideBar } from "./sideBar";

export const AdminHeader = ()=>{
  const [sidebarClicked , setSidebarClicked] = useState(false);
   return (
    <div className="z-50">
    <div className="w-96 shadow-xl max-w-sm bg-white">
       <div className=" flex flex-row justify-between ">
       <div className="flex flex-row p-2 gap-6">
         <div className="ml-2 pt-2" onClick={()=>{
              setSidebarClicked(true);
         }}> ☰</div>
           
       </div>

       <div className="p-3">
        <img src="/profile.png" alt="" className="size-9" />
       </div>
      
   </div>
        
    </div>
    {sidebarClicked && <AdminSideBar setSidebarClicked={setSidebarClicked} />}
    </div>
   )
}