export const DepositPage = ()=>{
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm flex flex-col justify-between">
            <div className="relative"> 
            <div className=" absolute top-16 left-0 px-4 flex flex-col gap-6">
                <div className="font-bold text-3xl">Choose amount to add</div>
                <div className="flex gap-1">
                <div className="text-2xl">₹</div>
                <input type="text" className="bg-gray-200 border border-b-black text-2xl " placeholder="Enter the deposit amount" />
                </div>
            <div className="font-extralight pl-4">Min: 50, Max: 100000</div>
            </div>
            </div>
            <div className="pb-12">
            <button className="bg-green-600 h-10 text-center p-2 w-96 rounded-xl ">Next</button>
            </div>
        </div>
    )
}