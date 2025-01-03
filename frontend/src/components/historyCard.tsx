export const HistoryCard = ()=>{
    return (
        <div className="bg-gray-300">
            <div className="flex">
                <div className=" mt-6 ml-4 border border-white h-20 w-20 p-3 text-xs font-bold text-yellow-600 ">Dec 23, 2024 at 05:37 PM</div>
                <div className=" mt-6 mr-4 border border-white h-20 w-64 p-1 font-bold  ">
                    <div className="flex justify-between pr-4">
                        <div className="flex flex-col gap-1 py-1 px-4">
                            <div className="text-sm">New User Bonus</div>
                            <div className="text-xs text-gray-400">OrderID: BBAQNQNME</div>
                            <div className="text-xs  font-bold text-green-500">Status:success</div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-600">(+)</div>
                            <img src="../../cash.png" alt="" className="size-5 mt-1 mr-1" />
                            <div className="font-bold text-green-600">10</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}