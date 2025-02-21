import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/url";

export const SideBar = (props : any)=>{
    const navigate = useNavigate();
    const { setAdminClicked, phoneNumber } = useUserContext();


    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      const checkAdmin = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/admin/check-admin/${phoneNumber}`);
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error("Error checking admin:", error);
          setIsAdmin(false);
        }
      };
  
      if (phoneNumber) {
        checkAdmin();
      }
    }, [phoneNumber]);
  

    return (
        <div className="bg-gray-300 fixed min-h-screen min-w-64  z-50 flex flex-col">
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
          <div className="pl-1 flex flex-col  gap-6">
            <div className="">
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/profile');
                props.setSidebarClicked(false);
              }}>
                <img src="../../user.png" alt=""  className="size-6"/>
                <div className="font-mono">My Profile</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/home');
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
</svg>

                <div className="font-mono">Win Cash</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/wallet');
                props.setSidebarClicked(false);
              }}>
                <img src="../../wallet.png" alt=""  className="size-6"/>
                <div className="font-mono">My Wallet</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/gameHistory');
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
</svg>

                <div className="font-mono">Game History</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/history');
                props.setSidebarClicked(false);
              }}>
                <img src="../../order-history.png" alt=""  className="size-6"/>
                <div className="font-mono">Transaction History</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/refer');
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>

                <div className="font-mono">Refer and Earn</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/notification');
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" >
  <path strokeLinecap="round" strokeLinejoin="round"  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>

                <div className="font-mono">Notification</div>
              </div>
              <div className="flex gap-4 p-3  rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/support');
                props.setSidebarClicked(false);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
</svg>

                <div className="font-mono">Support</div>
              </div>
              { isAdmin &&<div className="flex gap-4 p-3 rounded-lg hover:bg-gray-400" onClick={()=>{
                navigate('/admin');
                props.setSidebarClicked(false);
                setAdminClicked(true)
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>

                <div className="font-mono">Admin</div>
              </div>}
            </div>
          </div>
          </div>
    )
}