import { useState } from "react"

export const DepositPage = ()=>{
    const [amount , setAmount] = useState(0);
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm flex flex-col justify-between">
            <div className="relative"> 
            <div className=" absolute top-16 left-0 px-4 flex flex-col gap-6">
                <div className="font-bold text-3xl">Choose amount to add</div>
                <div className="flex gap-1">
                <div className="text-2xl pt-1">₹</div>
                <input type="number" className="bg-gray-200 border border-b-black text-2xl p-1" placeholder="Enter the deposit amount" onChange={(e)=>{
                    const num: number = +(e.target.value);
                    setAmount(num)}} />
                </div>
            <div className="font-extralight pl-4">Min: 50, Max: 100000</div>
            </div>
            <div className="bg-gray-100 absolute top-60 left-10 w-72 h-40 rounded-md p-4 text-sm flex flex-col gap-3 ">
                <div>Deposit Amount (excl. Govt. Tax): ₹ {Math.round(amount*((100-28)/100))}</div>
                <div>Govt. Tax (28% GST): ₹ {Math.round(amount*((28)/100))}</div>
                <div>Deposit Bonus : ₹ {Math.round(amount*((28)/100))}</div>
                <div>Total Payable Amount:  ₹ {amount}</div>
            </div>
            </div>
            <div className="pb-12">
            <button className="bg-green-600 h-10 text-center p-2 w-96 rounded-xl my-24 ">Next</button>
            </div>
        </div>
    )
}