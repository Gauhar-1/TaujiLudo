import { useNavigate } from "react-router-dom";

export const BettingCard = ()=>{
    const navigate = useNavigate();
    return ( 
        <div>
    <div className="border-black bg-white rounded-t-md mx-2 my-1 p-2 text-sm">
       <div>Challenge from Ashique</div>
    </div>
    <div className="border-black bg-white rounded-b-md mx-2 p-2 text-sm flex justify-between">
       <div className="flex gap-10">
        <div className="flex flex-col gap-1">
            <div className="font-serif text-purple-500">ENTRY</div>
            <div className="flex gap-2">
        <img src="../../cash.png" alt="" className="size-6"/>
         <div className="font-bold text-xs">150</div>
            </div>
        </div>
        <div className="flex flex-col gap-1">
            <div className="font-serif text-purple-500">PRICE</div>
            <div className="flex gap-2">
        <img src="../../cash.png" alt="" className="size-6"/>
         <div className="font-bold text-xs">292</div>
            </div>
        </div>
       </div>
       <button className="text-center font-mono bg-purple-700 text-white py-2 px-4 text-xs rounded-md" onClick={()=>{
        navigate('/battle');
       }}>Play</button>
    </div>
        </div>
    )
}