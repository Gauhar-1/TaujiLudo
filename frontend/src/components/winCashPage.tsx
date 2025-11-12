import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const WinCashPage = ()=>{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    useEffect(()=>{
      setIsLoading(true);
        setTimeout(()=>{
          setIsLoading(false);  
        },1000);
    },[])

    if(isLoading){
      return (
        <div className="flex items-center h-screen w-full ">
        <div className="bg-gray-200 mx-10 bg-opacity-100 shadow-xl p-10 rounded-md flex flex-col gap-4">
               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
             </div>
        </div>
      )
    }
    return (
        <div className="min-h-screen bg-gray-200 max-w-sm">
            <div className="py-16 flex flex-col ">
                <div className="bg-red-600 text-white  p-6 m-4 rounded-lg text-xs font-bold">Taujiludo पर आपका स्वागत है  विड्रॉल केवल 5 से 10 मिनट मैं Support 27*7
                  <br />
Commission = 5% &nbsp;&nbsp;&nbsp;
Refer = 2%</div>
                <div className="flex flex-col gap-2">
                    <div className="flex">
                        <div className="pr-2 pl-4 flex flex-col gap-1">
                            <div> ◉ LIVE</div>
                          <img src="/ludo1.jpg" alt="" className="h-52 " onClick={()=>{
                            navigate('/home')
                          }} />
                        </div>
                        <div className="pr-4 pl-2 flex flex-col gap-1">
                            <div> ◉ LIVE</div>
                          <img src="/ludo2.jpg" alt="" className="h-52 " />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="px-4 flex flex-col gap-1 w-48">
                            <div> ◉ Support</div>
                          <img src="/ludo6.jpg" alt="" className="h-52 " onClick={()=>{
                            navigate('/support')
                          }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}