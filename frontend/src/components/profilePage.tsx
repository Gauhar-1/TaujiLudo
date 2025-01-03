import { useNavigate } from "react-router-dom";

export const ProfilePage = (props : any)=>{
    const navigate = useNavigate();
    return ( 
    <div className=" ">
        <div className="flex flex-col left-0 inset-y-0 pt-12">
      <div className="bg-gray-200 max-w-sm  min-h-screen">
            <div className="m-5 bg-gray-600 rounded-xl flex flex-col hover:bg-gray-700 ">
                <div className="flex">
                <img src="../../profile.png" alt=""  className="h-32  p-3"/>
                <div className="text-white text-3xl font-serif m-10">Manish</div>
                </div>
                <div className="grid grid-cols-10 p-1 m-1">
                    <div className="col-start-2 flex gap-2">
                    <img src="../../call-icon.png" alt="" className="h-5 pt-1 "/>
                    <div className="text-white font-semibold ">9995246547</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-around m-4">
                <div className="bg-gray-400 h-16 w-40 rounded-md relative hover:bg-gray-700  font-bold">
                    <img src="../../wallet.png" alt="" className="size-7 absolute top-0 left-16 mt-2   " />
                    <div className="absolute top-8 left-10 mt-1">My Wallet</div>
                </div>
                <div className="bg-gray-400  rounded-md h-16 w-40 relative hover:bg-gray-700 ">
                    <img src="../../kyc.png" alt=""  className="size-7 absolute top-0 left-16 mt-2 " />
                    <div className="absolute top-8 left-6 mt-1 font-bold">Kyc completed</div>
                </div>
            </div>
                <div className="flex justify-around m-8">
                    <div className="">
                        <div className="relative bg-gray-300 h-32 w-20 rounded-md  hover:bg-green-500">
                        <img src="../../cash.png" alt="" className="size-6 absolute left-7 top-4"/>
                        <div className="font-bold text-white absolute left-8 top-20">0</div>
                        </div>
                        <div className="font-thin text-xs text-center p-2">cash won</div>
                    </div>
                    <div>
                    <div className="bg-gray-300 h-32 w-20 rounded-md  relative hover:bg-green-500">
                        <img src="../../battle.png" alt="" className="size-6 absolute left-7 top-4"/>
                        <div className="font-bold text-white absolute left-8 top-20">0</div>
                    </div>
                    <div className="font-thin text-xs text-center p-2">Battle Played</div>
                    </div>
                    <div>
                    <div className="bg-gray-300 h-32 w-20 rounded-md  relative hover:bg-green-500">
                        <img src="../../referal.png" alt="" className="size-6 absolute left-7 top-4"/>
                        <div className="font-bold text-white absolute left-8 top-20">0</div>
                    </div>
                    <div className="font-thin text-xs text-center py-2">Referal Earnings</div>
                    </div>
                </div>
                <div className="mt-20">
                <div className="absolute w-80 bg-gray-300 text-black rounded-xl p-2 m-8 border border-black text-center hover:cursor-pointer hover:bg-green-500 hover:text-white" onClick={()=>{
                    navigate('/login');
                    props.setLogin(false);
                }}>Log out</div>
                </div>
        </div>

        </div>
      </div>
       
    )
}