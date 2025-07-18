import { useEffect, useState } from "react"
import { HistoryCard } from "./historyCard"
import axios from "axios"
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";

export const HistoryPage = ()=>{
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
    
  }]>([{
    _id: "",
    userId: "",
    type: "",
    amount:0,
    message: "",
    status: "",
    paymentReference: "",
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
        <div className="bg-gray-300 pt-12 min-h-screen max-w-sm flex flex-col pb-16">
          {notifications.map((notification) => (
    <HistoryCard key={notification._id} notification={notification} />
  ))}
          
        </div>
    )
}