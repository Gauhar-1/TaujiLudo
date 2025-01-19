export const HistoryCard = (props : any)=>{
    const date =new Date(props.notification.createdAt).toLocaleString();
    return (
        <div className="bg-gray-300">
            <div className="flex">
                <div className=" mt-6 ml-4 border border-white h-20 w-20 p-3 text-xs font-bold text-yellow-600 ">{date}</div>
                <div className=" mt-6 mr-4 border border-white h-20 w-64  font-bold  ">
                    <div className="flex justify-between pr-4">
                        <div className="flex flex-col gap-1  px-4">
                            <div className="text-sm">New User Bonus</div>
                            <div className="text-xs text-gray-500">OrderID: {props.notification.paymentReference}</div>
                            <div className={`text-xs  font-bold text-green-500 ${props.notification.status === "success" ? "text-green-500": "text-red-500"}`}>Status:{props.notification.status}</div>
                        </div>
                        <div className="flex">
                            <div className={`text-gray-600 ${props.notification.type === "deposit" ? "text-green-500": "text-red-500"}`}>{props.notification.type === "deposit" ? "(+)": "(-)"}</div>
                            <img src="../../cash.png" alt="" className="size-5 mt-1 mr-1" />
                            <div className="font-bold text-green-600">{props.notification.amount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}