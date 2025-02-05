import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";

export const AdminSideBar = ( props : any)=>{
    const navigate = useNavigate();
    const [ playerButton , setPlayerButton ] = useState(false);
    const [ battleButton , setBattleButton ] = useState(false);
    const [ kycButton , setKycButton ] = useState(false);
    const [ paymentsButton , setPaymentsButton ] = useState(false);
    const { setAdminClicked } = useUserContext()

    return (
        <div className="bg-gray-200  shadow-lg fixed min-h-screen min-w-64  z-50 flex flex-col ">
          <div className="flex justify-between">
            <div className="pt-2">
            <img src="/logo.png" alt="" className="h-12"/>
            </div>
            <div className="p-4 font-bold text-lg" onClick={()=>{
            props.setSidebarClicked(false);
          }}>
            X
          </div>
            </div>
          <div className=" pl-2 flex flex-col ">
            <div className="">
              <div className="flex gap-4 p-3   rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/admin');
                props.setSidebarClicked(false);
              }}>
                <img src="../../user.png" alt=""  className="size-6"/>
                <div className="font-mono">DashBoard</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                // props.setSidebarClicked(false);
                playerButton ? setPlayerButton(false) : setPlayerButton(true);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
</svg>

                <div className="font-mono">Players</div>
              </div>
              { playerButton && <div className="bg-white mx-6 my-2 rounded-md p-4 flex flex-col gap-1">
                 <div className="text-gray-500 pb-1 text-sm">Players:</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate('allPlayers');
                 }}>All Players</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate('blocked');
                 }}>Blocked Players</div>
                </div>}
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                // props.setSidebarClicked(false);
                battleButton ? setBattleButton(false) : setBattleButton(true);
              }}>
                <img src="../../wallet.png" alt=""  className="size-6"/>
                <div className="font-mono">Battle</div>
              </div>
              { battleButton && <div className="bg-white mx-6 my-2 rounded-md p-4 flex flex-col gap-1">
                 <div className="text-gray-400 pb-1 text-xs font-bold">ALL BATTLE SHOW:</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("pendingBattle");
                 }}>New Battle</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("runningBattle");
                 }}>Running battle</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("completeBattle");
                 }}>Battle Result</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("disputeBattle");
                 }}>Battle Dispute</div>
                </div>}
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                // props.setSidebarClicked(false);
                kycButton ? setKycButton(false) : setKycButton(true)
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
</svg>

                <div className="font-mono">KYC</div>
              </div>
              { kycButton && <div className="bg-white mx-6 my-2 rounded-md p-4 flex flex-col gap-1">
                 <div className="text-gray-400 pb-1 text-xs font-bold">ALL BATTLE SHOW:</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("pendingKyc");
                 }}>Pending KYC</div>
                 <div className="text-sm">Approved KYC</div>
                </div>}
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                // props.setSidebarClicked(false);
                paymentsButton ? setPaymentsButton(false) : setPaymentsButton(true)
              }}>
                <img src="../../order-history.png" alt=""  className="size-6"/>
                <div className="font-mono">Payments</div>
              </div>
              { paymentsButton && <div className="bg-white mx-6 my-2 rounded-md p-4 flex flex-col gap-1">
                 <div className="text-gray-400 pb-1 text-xs font-bold">ALL PAYMENTS:</div>
                 <div className="text-sm" onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("allPayments");
                 }}>Payment Recieved</div>
                 <div className="text-sm"  onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("rechargeUser");
                 }}>Recharge to User</div>
                 <div className="text-sm"  onClick={()=>{
                  props.setSidebarClicked(false);
                  navigate("paymentSettings");
                 }}>Payment Settings</div>
                </div>}
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                props.setSidebarClicked(false);
                navigate("reqPayments");
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>

                <div className="font-mono ">Payment Request</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate("adminSettings");
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" >
  <path strokeLinecap="round" strokeLinejoin="round"  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>

                <div className="font-mono">Admin Settings</div>
              </div>
            
              <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('adminNotification');
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>

                <div className="font-mono">Notifications</div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/home');
                props.setSidebarClicked(false);
                setAdminClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>

                <div className="font-mono">Log Out</div>
              </div>
            </div>
          </div>
          

          </div>
    )
}