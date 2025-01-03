import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { SideBar } from "./sideBar";

export const Header = (props: { login: boolean })=>{
  const [sidebarClicked , setSidebarClicked] = useState(false);
  const navigate = useNavigate();
   return (
    <div>

    <div className="fixed left-0 top-0  w-96 shadow-xl max-w-sm bg-white">
      { props.login && <div className=" flex flex-row justify-between ">
       <div className="flex flex-row p-2 gap-6">
         <div className="ml-2 pt-2" onClick={()=>{
              setSidebarClicked(true);
         }}> ☰</div>
           
           <img src="../../rkludologo.png" alt=""  className="h-6 mt-3"/>
       </div>
       <div className="m-3 flex gap-2">
         <div className="bg-green-900 flex flex-row  rounded-md h-8 w-20">
         <img src="../../money.png" alt=""  className="h-5 m-1"/>
         <div className="text-xs text-white">cash  10</div>
         <div className="bg-black" onClick={()=>{
          navigate('wallet');
         }}>
         <img src="../../plus sign.png" alt="" className="h-5 mt-1 p-1 "/>
         </div>
         </div>
         <div className="bg-green-900 flex flex-row gap-1 rounded-md h-8 w-20">
         <img src="../../moneyBag.png" alt=""  className="h-5 m-1" />
         <div className="text-xs  text-white ">Earning :- 0</div>
         </div>
       </div>
   </div>}
       {!props.login && <div className="flex justify-center">
        <img src="../../rkludologo.png" alt=""  className="h-6 m-3 "/>
       </div>}
        
    </div>
    {sidebarClicked && <SideBar setSidebarClicked={setSidebarClicked} />}
    </div>
   )
}