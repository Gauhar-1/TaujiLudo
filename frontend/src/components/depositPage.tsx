import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const DepositPage = (props : any)=>{
    const[amount , setAmount] = useState<number>(props.amount)
    const [upiId, setUpiId] = useState<string>('');
    const [upiLink, setUpiLink] = useState<string>('');
    const navigate = useNavigate()

    const handleDeposit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/deposit', {
                userId: props.userId, // Replace with the logged-in user's ID
                amount,
                paymentMethod: 'upi',
                upiId,
            });
            setUpiLink(response.data.upiLink);
            props.setAmount((prevCount: number) => prevCount + amount);
            console.log('Deposit initiated. Complete the payment.');
        } catch (err : any) {
            console.log('Error initiating deposit: ' + err.response?.data?.message || err.message);
        }
    };

    
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm flex flex-col justify-between">
            <div className="relative"> 
            <div className=" absolute mt-6 top-16 left-0 px-4 flex flex-col gap-6">
                
            <div className="bg-gray-200 min-h-screen max-w-sm ">
            <div className=" relative ">
                <div className="absolute  rounded-md bg-gray-300 m-2 ">
                <div className="p-4 w-80 text-center font-serif text-2xl">Deposit via UPI</div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Your Linked UPI ID</div>
                    <input type="text" className="rounded-md border border-gray-950 py-1 px-2" onChange={(e)=>{
                        setUpiId(e.target.value)
                    }}/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Amount to Deposit:</div>
                    <input type="text" className="rounded-md border border-gray-950 py-1 px-2" onChange={(e)=>{
                        const newValue = parseInt(e.target.value);
                        setAmount(newValue);
                    }}/>
                    <div className="font-extralight pl-4">Min: 50, Max: 100000</div>
                    <div className="bg-gray-200  top-60 left-10 w-72 h-40 rounded-md p-4 text-sm flex flex-col gap-3 ">
                <div>Deposit Amount (excl. Govt. Tax): ₹ {Math.round(amount*((100-28)/100))}</div>
                <div>Govt. Tax (28% GST): ₹ {Math.round(amount*((28)/100))}</div>
                <div>Deposit Bonus : ₹ {Math.round(amount*((28)/100))}</div>
                <div>Total Payable Amount:  ₹ {amount? amount : 0}</div>
            </div>
                 </div>
                 <div className="p-2 flex justify-center">
                 <div className=" bg-green-500 h-10 w-64 rounded-md text-center text-white pt-2 mb-2" onClick={handleDeposit}>Deposit</div>
                 </div>
                 <div className="flex justify-center">
                 <div className="bg-gray-700 w-28 text-center rounded-md p-1 mb-8 text-white" onClick={()=>{
                    navigate('/wallet')
                 }}>back</div>
                 </div>
                </div>
            </div>
        </div>  
            </div>
            </div>
            
        </div>
    )
}