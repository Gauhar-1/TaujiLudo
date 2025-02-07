import {  formatDistanceToNowStrict } from "date-fns"

export const NotifyCard = ( props : any)=>{
    return (
        <div className="mx-6 mb-2  bg-red-300 p-4 rounded-md border border-black shadow-md flex flex-col">
            <div className=" w-full overflow-auto break-words">{props.notification.reason}</div>
            <div className="flex justify-end text-gray-500">
            <div>
            {formatDistanceToNowStrict(new Date(props.notification.createdAt), { addSuffix: true })}
    </div>
            </div>
        </div>
    )
}