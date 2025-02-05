export const NotifyCard = ()=>{
    return (
        <div className="p-4">
           { <div className=" border border-black bg-gray-400 rounded-lg flex justify-between p-3">
            <div className="flex">
            <div>
                    <img src="/profile.png" alt="" className="h-10"/>
                </div>
                <div className="px-4 font-serif text-lg  ">
                    <div className="flex gap-2">
                    <div className="text-white">Manish</div>
                    {/* <div className="text-green-300 pt-1">has joined!!</div> */}
                    <div className="text-green-300">has deposited!!</div>
                    </div>
                    <div className="flex gap-1">
                        <img src="/money.png" alt="" className="h-5"/>
                        <div className="text-sm ">(+)</div>
                        <div className="text-sm font-mono">500</div>
                    </div>
                </div>
            </div>
                <div className="flex  flex-col gap-2">
                    <div className="flex justify-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6" >
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>

                    </div>
<div className="text-xs">5 hour ago</div>

                </div>

            </div>}
        </div>
    )
}