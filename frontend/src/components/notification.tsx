import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { NotifyCard } from "../utils/notifyCard";

export const Notifications = ()=>{
  const { userId } = useUserContext() ;
  const[notifications, setNotifications] = useState<[{
      reason: string;
      status: string;
      _id: string;
      userId: string;
      type: string;
      createdAt: string;
    
  }]>([{
    _id: "",
    reason: "",
    status: "",
    userId: "",
    type: "",
    createdAt: ""
  }]);

  
     useEffect(()=>{

      const loadNotificatons = async()=>{
       try{ const response = await axios
        .get(`${API_URL}/api/auth/notifications`, {params: { userId }})

            if(response.data.success){
                console.log("Notification received successfully");
              }
              else {
                console.log("Failed to get Notifications");
              }
              
              setNotifications(response.data);
            }
              catch(err){
                console.log("err :" +err);
              }
          }
          
          loadNotificatons();
  },[userId, setNotifications])
  
    return (
        <div className="bg-gray-300 py-20 min-h-screen max-w-sm flex flex-col gap-2">
           {notifications
    .filter((notification) => 
      notification.status === "failed" && notification.reason
    )
    .map((notification) => (
      <NotifyCard key={notification._id} notification={notification} />
    ))}
          
        </div>
    )
}