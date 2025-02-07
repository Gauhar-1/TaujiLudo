import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { NotifyCard } from "../utils/adminNotifyCard";

export const AdminNotification = ()=>{
    const { userId } = useUserContext() ;
  const[notifications, setNotifications] = useState<[{
      _id: string;
      userId: string;
      type: string;
      amount: number;
      message: string;
      status: string;
      paymentReference: string;
      createdAt: string;
      markAsRead: boolean;
    
  }]>([{
    _id: "",
    userId: "",
    type: "",
    amount:0,
    message: "",
    status: "",
    paymentReference: "",
    createdAt: "",
    markAsRead: false
  }]);

  
     useEffect(()=>{
      
    //  if(!userId){
    //   console.log("Userid not yet found");
    //  }

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
        <div className="bg-gray-200 pt-16 min-h-screen max-w-sm flex flex-col pb-16">
          {notifications.map((notification) => (
    <NotifyCard key={notification._id} notification={notification} />
  ))}
        </div>
    )
}