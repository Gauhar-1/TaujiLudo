import { useNavigate } from "react-router-dom"

export const WithdrawPage =()=>{
    const navigate = useNavigate();
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm p-2"> 
            <div className="flex flex-col justify-start pt-16 gap-4 px-8">
                <div className="font-serif text-2xl">Choose withdrawal option</div>
                <div className="bg-white flex p-4 rounded-md gap-4 hover:cursor-pointer" onClick={()=>{
                    navigate('/withdrawToUPI')
                }}>
                    <img src="../../upi.webp" alt="" className="h-10 w-20" />
                    <div className="flex flex-col">
                        <div className="text-center font-semibold text-violet-600">Withdraw to UPI</div>
                        <div className="text-center text-xs">Minimum withdrawl amount ₹150</div>
                    </div>
                </div>
                <div className="bg-white flex p-4 rounded-md gap-4 hover:cursor-pointer" onClick={()=>{
                    navigate('/withdrawToBank')
                }}>
                    <img src="../../bank.png" alt="" className="size-12" />
                    <div className="flex flex-col">
                        <div className="text-center font-semibold pl-8 text-violet-600 ">Withdraw to Bank</div>
                        <div className="text-center text-xs pl-8">Minimum withdrawl amount ₹150</div>
                    </div>
                </div>
            </div>
        </div>
    )
}