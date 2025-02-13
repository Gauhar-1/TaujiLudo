import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { NotifyCard } from "../utils/notifyCard";

export const Notifications = ()=>{
  const { userId } = useUserContext() ;
  const [combinedData, setCombinedData] = useState<
    {
      kycDetails: any;
      _id: string;
      reason?: string;
      status?: string;
      userId?: string;
      type?: string;
      createdAt: string;
      profile?: any;
      dispute : [] // Store profile data if available
    }[]
  >([]);

  
     useEffect(()=>{

      const loadNotificatons = async()=>{
        try {
          // 🔵 Fetch Notifications
          const response = await axios.get(`${API_URL}/api/auth/notifications`, {
            params: { userId },
            withCredentials: true, // Ensure cookies are sent
          });
    
          let notifications = response.data?.map((n: any) => ({
            ...n,
            Date: new Date().toISOString(),
            type: "notification",
          })) || [];
    
          // 🔵 Fetch Profiles
          const profileResponse = await axios.get(`${API_URL}/api/auth/getProfiles`, {
            withCredentials: true,
          });
    
          let profiles = profileResponse.data?.map((p: any) => ({
            ...p,
            Date: new Date().toISOString(),
            type: "profile",
          })) || [];
    
          // 🔵 Fetch Battles
          const battleResponse = await axios.get(`${API_URL}/api/auth/battles/battleHistory`, {
            withCredentials: true,
          });
    
          let battles = battleResponse.data?.map((b: any) => ({
            ...b,
            Date: new Date().toISOString(),
            type: "Battle",
          })) || [];
    
          // 🔵 Merge & Sort by `createdAt`
          const mergedData = [...notifications, ...profiles, ...battles].sort((a, b) => {
            const dateA = new Date(a.kycDetails?.createdAt || a.createdAt || (a.dispute ? a.dispute.timestamp : 0)).getTime();
            const dateB = new Date(b.kycDetails?.createdAt || b.createdAt || (b.dispute ? b.dispute.timestamp : 0)).getTime();
            return dateB - dateA; // Sort newest first
          });
    
          setCombinedData(mergedData);
        } catch (err) {
          console.error("🛑 Error loading notifications:", err);
        }
          }
          
          loadNotificatons();
  },[userId])

  
    return (
        <div className="bg-gray-300 py-20 min-h-screen max-w-sm flex flex-col gap-2">
           {combinedData
    .filter((notification) => 
      {if (notification.type === "notification") return !!notification.reason;
    if (notification.type === "profile") return !!notification.kycDetails?.reason;
    if (notification.type === "Battle") return notification.dispute && Object.keys(notification.dispute).length > 0;
    return false;}
    )
    .map((notification) => (
      <NotifyCard key={notification._id} notification={notification} />
    ))}
          
        </div>
    )
}