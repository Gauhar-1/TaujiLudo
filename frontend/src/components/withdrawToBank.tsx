import { useNavigate } from "react-router-dom"

export const  WithdrawToBank = ()=>{
    const navigate = useNavigate();
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm ">
            <div className=" relative ">
                <div className="absolute top-20 rounded-md bg-gray-300 m-6 ">
                <div className="p-4 w-80 text-center font-serif text-2xl">Withdrawal To Bank</div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Account Holder's Name:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1"/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Account Number:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1"/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">IFSC Code:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1"/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Amount to Withdraw:</div>
                    <input type="text" className="rounded-md border border-gray-950 p-1"/>
                 </div>
                 <div className="p-2 flex justify-center">
                 <div className=" bg-green-500 h-10 w-64 rounded-md text-center pt-2 mb-2">Withdraw</div>
                 </div>
                 <div className="flex justify-center">
                 <div className="bg-green-700 w-28 text-center rounded-md p-1 mb-8" onClick={()=>{
                    navigate('/withdraw')
                 }}>back</div>
                 </div>
                </div>
            </div>
        </div>
    )
}