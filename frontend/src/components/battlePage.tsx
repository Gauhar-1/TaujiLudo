import axios, { formToJSON } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const BattlePgage = (props: any)=>{ 
    const navigate = useNavigate();
    const [woned, setWoned] = useState(false);
    const [losed, setLosed] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [ battle, setBattle ] = useState({
        "_id": "",
        "player1Name": "",
        "player2Name": "",
        "player1": "",
        "player2": null,
        "amount": 0,
        "prize": 0,
        "screenShot": null,
        "status": "",
        "ludoCode": "",
        "winner": null,
        "createdAt": "",
        "__v": 0
    
    });
    const [selectedFile , setSelectedFile] = useState<File | null>(null);
    const [ reason , setReason ] = useState<String | null >("");


    useEffect(()=>{
           
           const battleId = props.battleId;
 
           const inBattle = async()=>{
               try{const response = await axios.get('http://localhost:3000/api/auth/battles/inBattle', { params : { battleId }} );

               if(!response){
                  console.log("Battle not found");
               }

               setBattle(response.data);}
               catch(err){
                console.log("Error: "+ err);
               }
           }

           inBattle();

    },[])

    const canceledBatlle = async()=>{
          
        try{

            const response = await axios.post('http://localhost:3000/api/auth/battles/inBattle/canceled' ,{
                battleId : battle._id,
                reason : reason
            });

            if(!response){
                console.log("No response found");
                return;
            }
            navigate('/');

        }
        catch(err){
            console.log("Error: "+ err);
        }
    }


    const uploadScreenShot = async()=>{

        const battleId = props.battleId;

        if (!selectedFile) {
            console.log('Please select a file first.');
            return;
          }
      
          const formData = new FormData();
          formData.append('image', selectedFile);
          formData.append('battleId', battleId);  // Append battleId to formData
         
          setWoned(false);

          // Log the formData contents (without direct string conversion)
          for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }

      
          try {
            const response = await axios.post('http://localhost:3000/api/auth/battles/inBattle/uploads', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
          } catch (error : any) {
            console.log("Error: "+error);
            console.error("Error uploading the image: ", error.response ? error.response.data : error.message);

          }
        
    }

    return (
        <div className="bg-white min-h-screen max-w-sm">
            <div className="pt-16">
                <div className="flex justify-between px-4">
                    <div className="flex gap-2" onClick={()=>{
                        navigate('/');
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="green" className="size-5 mt-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
                        <div className="font-semibold text-green-600">Back</div>
                    </div>
                    <div className="flex gap-2" onClick={()=>{
                           navigate('/rules')
                    }}>
                    <div className="text-gray-400 font-semibold">Rules</div>
                    <img src="../../info.png" alt="" className="size-5 mt-1" />
                    </div>
                </div>
                <div className="bg-gray-200 rounded-lg mx-4 my-6 p-4">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2 p-2">
                            <img src="../../profile.png" alt="" className="size-24" />
                            <div className="text-center w-24 font-serif">{battle.player1Name}</div>
                        </div>
                        <img src="../../vs.png" alt="" className="size-10 mt-10"/>
                        <div className="flex flex-col gap-2 p-2">
                            <img src="../../profile.png" alt="" className="size-24" />
                            <div className="text-center w-24 font-serif">{battle.player2Name}</div>
                        </div>
                    </div>
                    <div className="flex gap-24 pt-6 justify-center">
        <div className="flex  gap-2">
            <div className="font-mono text-sm text-purple-500">ENTRY</div>
            <div className="flex gap-2">
        <img src="../../cash.png" alt="" className="size-6"/>
         <div className="font-bold text-xs">{battle.amount}</div>
            </div>
        </div>
        <div className="flex  gap-1">
            <div className="font-mono text-sm text-purple-500">PRICE</div>
            <div className="flex gap-2">
        <img src="../../cash.png" alt="" className="size-6"/>
         <div className="font-bold text-xs">{battle.prize}</div>
            </div>
        </div>
       </div>
                </div>
                <div className="flex justify-center">
                <div className="bg-gray-300 rounded-xl w-48 p-2 ">
                    <div className=" font-bold p-1 text-xl text-center">Ludo Code</div>
                    <div className="flex gap-2 justify-between  bg-gray-400 rounded-lg m-2 p-3">
                        <div className="font-mono text-lg">{battle.ludoCode}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" 
                        >
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
</svg>

                    </div>
                </div> 
                </div>
               
            </div>
            <div className="flex justify-center mt-6">
            <div className="bg-gray-300 rounded-lg w-80 p-4">
                <div className="text-lg font-bold text-green-700">Match Status</div>
                <div className="font-mono text-sm pt-1">After completion of your game, select the status of the game and post your screenshot below.</div>
                <div className="flex gap-4 mt-4">
                    <div className="bg-green-600 py-2 px-4 rounded-md text-white" onClick={()=>{
                        setWoned(true);
                    }}>I won</div>
                    <div className="bg-red-600 py-2 px-4 rounded-md text-white" onClick={()=>{
                        setLosed(true);
                    }}>I lose</div>
                    <div className="bg-gray-400 py-2 px-4 rounded-md text-white" onClick={()=>{
                        setCanceled(true);
                    }}>cancel</div>
                </div>
            </div>
            </div>
            {woned && <div className="bg-gray-100 absolute top-64 left-16 w-60 rounded-lg p-4">
                <div className="flex justify-between">
                    <div className="relative">
                <div className="absolute w-48 left-2 text-center text-xl font-bold  ">Upload Result</div>
                    </div>
                <div className="font-bold pl-8 text-lg" onClick={()=>{
                    setWoned(false);
                }}>X</div>
                </div>
                <input  type="file" id="fileInput" className="text-center bg-green-600 mt-8 rounded-lg p-2 w-52 text-white text-sm " onChange={(e)=>{
                    if(e.target.files)
                    setSelectedFile(e.target.files[0])
                }} />
                <div className="text-center bg-blue-600 mt-4 rounded-lg p-2 mx-16 text-white " onClick={uploadScreenShot}>Done</div>
                </div>}
            {losed && <div className="bg-gray-100 absolute top-64 left-16 w-60 rounded-lg p-4">
                <div className="flex  px-2">
                    <div className="">
                <div className=" w-40  text-center text-md font-bold  ">Are you sure you lost the game?</div>
                    </div>
                <div className="font-bold pl-8 text-lg" onClick={()=>{
                    setLosed(false);
                }}>X</div>
                </div>
                <div className="text-center bg-red-600 mt-4 rounded-lg p-2 text-white">Yes, I lose</div>
                <div className="text-center bg-blue-600 mt-4 rounded-lg p-2 mx-16 text-white">No</div>
                </div>}
            {canceled && <div className="bg-gray-100 absolute top-64 left-10 w-80 rounded-lg p-4">
                <div className="flex  px-2">
                    <div className="">
                <div className=" w-56  text-center text-md font-bold text-purple-600 ">We Would like to know more</div>
                <div className=" w-44 text-center  text-sm font-thin  ">Select : Reason for cancelling</div>
                    </div>
                <div className="font-bold pl-8 text-lg" onClick={()=>{
                    setCanceled(false);
                }}>X</div>
                </div>
                <div className="grid grid-cols-2 mt-2 ml-4 gap-2">
                    <div className="text-xs font-thin  bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("No room code")
                    }}>No room code</div>
                    <div className="text-xs bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("Not joined")
                    }}>Not joined</div>
                    <div className="text-xs bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("Not Playing")
                    }}>Not Playing</div>
                    <div className="text-xs bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("Don't want to play")
                    }}>Don't want to play</div>
                    <div className="text-xs bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("Opponent Abusing")
                    }}>Opponent Abusing</div>
                    <div className="text-xs bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("Game not started")
                    }}>Game not started</div>
                    <div className="text-xs bg-green-600 text-white text-center p-1 rounded-md" onClick={()=>{
                        setReason("Others")
                    }}>Others</div>
                </div>
                <div className="text-center bg-blue-600 mt-4 rounded-lg p-2 text-white" onClick={()=>{
                    canceledBatlle();
                }}>Submit</div>
                </div>}
        </div>
    )
}