import { useNavigate } from "react-router-dom"

export const WinCashPage = ()=>{
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-200 max-w-sm">
            <div className="pt-20 pb-16 flex flex-col gap-4">
                <div className="bg-red-600 text-white p-6 m-4 rounded-lg text-xs font-bold">हम आपको सबसे कम कमीशन दर प्रदान करते हैं! हमारे साथ, आप केवल 3% कमीशन का भुगतान करेंगे और 3% रेफर और अर्न का लाभ उठा सकते हैं। यह सुनिश्चित करता है कि आप अधिकतम लाभ कमा सकें</div>
                <div className="flex flex-col gap-4">
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