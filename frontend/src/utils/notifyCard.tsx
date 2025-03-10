import {  formatDistanceToNowStrict } from "date-fns"
import { useUserContext } from "../hooks/UserContext";

export const  NotifyCard = ( { notification }: { notification: any })=>{
    if (!notification.Date ){
        return null;
    } 
    const { userId } = useUserContext();
    return (
        <div className="mx-6 mb-2  bg-white  rounded-md border border-gray-300 shadow-md flex flex-col">
          <div className={`bg-blue-500 px-3 py-1 text-white font-bold rounded-t-md ${notification.type === "notification" ? "bg-blue-500" : notification.type === "profile" ? "bg-green-500" : "bg-yellow-500" }`}>{notification.type === "notification" ? "Transaction" : notification.type}</div>
             {/* Display different content based on type */}
      {notification.type === "notification" ? (
        <div className="w-full overflow-auto break-words p-1">
          {notification.reason ? notification.reason : "No notifications"}
        </div>
      ) : notification.type === "profile"  ? (
        <div className="w-full overflow-auto break-words p-1">
          {notification.kycDetails.reason ? notification.kycDetails.reason : "No notifications"}
        </div>
      ) :  <div className="w-full overflow-auto break-words p-1">
      {notification.dispute?.proofs?.[1]?.player === userId 
  ? (notification.dispute?.proofs?.[1]?.adminReason ? notification.dispute?.proofs?.[1]?.adminReason : "No notifications")
  : notification.dispute?.proofs?.[0]?.adminReason ? notification.dispute?.proofs?.[0]?.adminReason : "No notifications" }

    </div>}
            <div className="flex justify-end text-gray-500 p-1" >
           { notification.type === "profile"  ? <div>
            {formatDistanceToNowStrict(new Date(notification.kycDetails.createdAt), { addSuffix: true })}
    </div> : notification.type === "notification"  ? <div>
            {formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true })}
    </div> :<div>
            {formatDistanceToNowStrict(new Date(notification.dispute?.timestamp), { addSuffix: true })}
    </div>}
            </div>
        </div>
    )
}