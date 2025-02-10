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
      profile?: any; // Store profile data if available
    }[]
  >([]);

  
     useEffect(()=>{

      const loadNotificatons = async()=>{
       try{ const response = await axios
        .get(`${API_URL}/api/auth/notifications`, {params: { userId }})

        let notifications = [];
        if (response.data) {
          notifications = response.data.map((n: any) => ({
            ...n,
            type: "notification", // Add type identifier
          }));
        }
              
               // Fetch Profiles
        const profileResponse = await axios.get(`${API_URL}/api/auth/getProfiles`);

        let profiles = [];
        if (profileResponse.data) {
          profiles = profileResponse.data.map((p: any) => ({
            ...p,
            type: "profile", // Add type identifier
          }));
        }

        // Merge & Sort by `createdAt`
        const mergedData = [...notifications, ...profiles].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log("Merge data: ", mergedData);

        setCombinedData(mergedData);
            }
              catch(err){
                console.log("err :" +err);
              }
          }
          
          loadNotificatons();
  },[userId])

  
    return (
        <div className="bg-gray-300 py-20 min-h-screen max-w-sm flex flex-col gap-2">
           {combinedData
    .filter((notification) => 
      notification.type === "notification" ? notification.reason : notification.kycDetails?.reason
    )
    .map((notification) => (
      <NotifyCard key={notification._id} notification={notification} />
    ))}
          
        </div>
    )
}