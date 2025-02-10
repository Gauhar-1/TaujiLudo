import {  formatDistanceToNowStrict } from "date-fns"

export const  NotifyCard = ( { notification }: { notification: any })=>{
    if (!notification.Date ){
        return null;
    } 
    return (
        <div className="mx-6 mb-2  bg-red-300 p-4 rounded-md border border-black shadow-md flex flex-col">
             {/* Display different content based on type */}
      {notification.type === "notification" && !notification.kycDetails?.reason ? (
        <div className="w-full overflow-auto break-words">
          {notification.reason}
        </div>
      ) : (
        <div className="w-full overflow-auto break-words">
         hii {notification.kycDetails.reason}
        </div>
      )}
            <div className="flex justify-end text-gray-500">
           { notification.kycDetails.createdAt ? <div>
            {formatDistanceToNowStrict(new Date(notification.kycDetails.createdAt), { addSuffix: true })}
    </div> : <div>
            {formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true })}
    </div>}
            </div>
        </div>
    )
}