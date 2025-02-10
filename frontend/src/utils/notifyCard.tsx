import {  formatDistanceToNowStrict } from "date-fns"

export const  NotifyCard = ( { notification }: { notification: any })=>{
    if (!notification.Date ){
        return null;
    } 
    return (
        <div className="mx-6 mb-2  bg-red-300 p-4 rounded-md border border-black shadow-md flex flex-col">
             {/* Display different content based on type */}
      {notification.type === "notification" ? (
        <div className="w-full overflow-auto break-words">
          {notification.reason}
        </div>
      ) : (
        <div className="w-full overflow-auto break-words">
          {notification.kycDetails.reason}
        </div>
      )}
            <div className="flex justify-end text-gray-500">
           { notification.type === "profile"  ? <div>
            {formatDistanceToNowStrict(new Date(notification.kycDetails.createdAt), { addSuffix: true })}
    </div> : <div>
            {formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true })}
    </div>}
            </div>
        </div>
    )
}