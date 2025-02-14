import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";

export const ReferPage = ()=>{
    const divRef = useRef<HTMLDivElement>(null);
    const [referalLink, setReferalLink] = useState("");
    const [referals, setReferals] = useState(0);
    const { phoneNumber } = useUserContext();

    useEffect(() => {
        const handleReferal = async()=>{
            const response = await axios.get(`${API_URL}/api/auth/findProfile` ,{ params : { phoneNumber }});

            if(!response.data){
                return console.log("Response Not found");
            }

            const { referalLink , referalCount } = response.data[0];
            setReferalLink(referalLink);
            setReferals(referalCount);
        }

        handleReferal();

        
      }, [phoneNumber]);

  const copyToClipboard = () => {
    if (divRef.current) {
      const text = divRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    }
  };
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm pt-12 pb-12">
            <div className="px-16">
                <img src="refer1.png" alt="" className="h-52" />
            </div>
            <div className="bg-gray-300  shadow-md mx-8">
                    <div className="bg-gray-400 text-center rounded-t-lg text-gray-200 font-bold p-1">Your Referral Earnings</div>
                    <div className="flex p-1 justify-center">
                        <div className="flex flex-col gap-3 text-center py-2 px-3 border-r ">
                            <div className="text-sm font-semibold rounded-md">Referred Players</div>
                            <div className="text-xs font-semibold">{referals}</div>
                        </div>
                        <div className="flex flex-col gap-3 text-center py-2 px-3 border-l ">
                            <div className="text-sm font-semibold">Referral Earning</div>
                            <div className="text-xs font-semibold">0</div>
                        </div>
                    </div>
                </div>
            <div className="bg-gray-300  shadow-md mx-8 my-6">
                    <div className="bg-gray-400 text-center rounded-t-lg text-gray-200 font-bold p-1">Referal Code</div>
                    <div className="flex p-1  justify-center">
                        <div className="flex ">
                            <div ref={divRef} className="bg-gray-400 p-4 rounded-md m-1 text-white w-40 text-center truncate">{referalLink}</div>
                            <button className="bg-gray-400 p-4 rounded-md m-1 text-white" onClick={()=>{
                                copyToClipboard();
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6 ">
  <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
  <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
</svg>

                            </button>
                        </div>
                    </div>
                </div>
            <div className="bg-gray-300  shadow-md mx-8 my-6">
                    <div className="bg-gray-400 text-center rounded-t-lg text-gray-200 font-bold p-1">How it Works</div>
                    <div className="flex flex-col px-5 py-3 gap-2  justify-center">
                       <div>1. You can refer and Earn 3 % of your referral winning, every time</div>
                       <div>2. Like if your player plays for PlayLudoKing Coin. 20000 and wins, You will get PlayLudoKing Coin. 200 as referral amount.</div>
                    </div>
                </div>
        </div>
    )
}