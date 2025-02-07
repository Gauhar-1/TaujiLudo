import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../utils/url";
import { NotifyCard } from "../utils/adminNotifyCard";

type NotificationType = {
  _id: string;
  userId: string;
  type: string;
  amount: number;
  message: string;
  status: string;
  paymentReference: string;
  createdAt: Date;
  markAsRead: boolean;
};

export const AdminNotification = ()=>{
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  
     useEffect(()=>{
      
    //  if(!userId){
    //   console.log("Userid not yet found");
    //  }

      const loadNotificatons = async()=>{
       try{ const response = await axios
        .get(`${API_URL}/api/auth/allNotifications`)

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
  },[])
  
    return (
        <div className="bg-gray-200 pt-16 min-h-screen max-w-sm flex flex-col pb-16">
          {notifications.map((notification) => (
    <NotifyCard key={notification._id} notification={notification} />
  ))}
        </div>
    )
}