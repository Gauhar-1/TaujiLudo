import { useEffect, useState } from "react"
import axios from "axios"
import { useUserContext } from "../hooks/UserContext"
import { API_URL } from "../utils/url"
import { useNavigate } from "react-router-dom"
// import { useLocation } from "react-router-dom"

export const KycVerification = ()=>{
    const [ username, setUserName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ kycDetails, setKycDetails ] = useState({
        Name: "",
        DOB: "",
        state: "",
        documentName: "",
        documentNumber: "",
        status: "",
        frontView: "",
        backView: "",
    });
    const [ rejectClicked, setRejectClicked ] = useState(false);
    const [ frontViewClicked, setFrontViewClicked ] = useState(false);
    const [ backViewClicked, setBackViewClicked ] = useState(false);
    const [ reason, setReason ] = useState("");

    const { phoneNumber, userId, setUserId } = useUserContext();

    const navigate = useNavigate();
    // const navigate = useLocation();
    
    useEffect(()=>{
        const handle = async()=>{
            if(phoneNumber){
                console.log("UserId: " + phoneNumber);
            }
            try{const response = await axios.get(`${API_URL}/api/auth/findProfile`, { params : { phoneNumber }});

            if(!response.data){
                 return console.log("response not found" , response.data);
            }
            console.log(response.data)

            const { name ,  email, kycDetails, filename, path, userId } = response.data[0];


            setKycDetails(kycDetails);
            setUserName(name);
            setEmail(email  || "N/A");
            setUserId(userId)
            kycDetails.filename = filename;
            kycDetails.path = path;
            console.log("profile fetched successfully");
            }
            catch(err){
                console.log("Error: " + err);
            }
        }
        handle();
    },[]);
    

    const handleVerify = async()=>{
        try{
            if(userId){
                console.log("Battle Id", userId);
            }

            const response = await axios.post(`${API_URL}/api/auth/verify-kyc`,{userId})

            if(!response.data){
                console.log("Response: "+response.data);
            }

        }
        catch(err){
            console.log("Error: "+ err);
        }
    }
    const handleReject = async()=>{
        try{
            if(userId){
                console.log("User Id",userId);
            }

            const response = await axios.post(`${API_URL}/api/auth/reject-kyc`,{userId, reason})

            if(response.data){
                console.log("Response: "+response.data);
            }

        }
        catch(err){
            console.log("Error: "+ err);
        }
    }

    return (
        <div className="max-w-sm bg-gray-200 min-h-screen pb-4 pt-4 px-4">
                   <div className="text-3xl font-serif pb-4">Kyc Verification</div>
                   <div className="bg-white  rounded-md shadow-md pb-4">
                    <div className="bg-gray-300 flex justify-center gap-2 p-6">
                        <div className="">
                            <img src="/Avatar.png" alt="" className="size-24"/>
                        </div>
                        <div className="flex flex-col gap-1 p-2" >
                            <div className="font-bold text-lg">{username}</div>
                            <div>{phoneNumber}</div>
                            <div>{email}</div>
                        </div>
                    </div>
                       <div className="bg-gray-300  flex justify-between mt-2">
                           <div className=" font-semibold  py-3 px-4 text-blue-600 border-b-2">KYC Status
                           </div>
                           <div className="flex gap-2 py-3 px-4">
                           {kycDetails.status === "pending" && <div className="bg-green-400 text-white py-1 px-2 rounded-md" onClick={handleVerify}>Approve</div>}
                            <div className="bg-red-500 text-white py-1 px-2 rounded-md" onClick={()=>{
                                setRejectClicked(true);
                            }}> Reject</div>
                           </div>
                       </div>

                       <div className="bg-blue-700 shadow-md font-semibold  py-3 px-4 text-gray-300 border-b-2">KYC Document Detail
                       </div>
                       <div className="p-4">
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2">Doucument No.</div>
                        <div className="border border-gray-400 w-40 p-2">{kycDetails.documentNumber}</div>
                       </div>
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2"> Name</div>
                        <div className="border border-gray-400 w-40 p-2">{kycDetails.Name}</div>
                       </div>
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2">DOB</div>
                        <div className="border border-gray-400 w-40 p-2">{kycDetails.DOB}</div>
                       </div>
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2">State</div>
                        <div className="border border-gray-400 w-40 p-2">{kycDetails.state}</div>
                       </div>
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2">Front Side</div>

                        <div className="border border-gray-400 w-40 p-2 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" onClick={()=>{
                           if(!frontViewClicked){
                            setFrontViewClicked(true)
                        }
                        else{
                            setFrontViewClicked(false);
                        }
                        }}>
  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
</svg>
                        </div>
                       
                       </div >
                       { frontViewClicked && <div className="bg-gray-400 p-6 mx-6 my-4  rounded-lg">
                            <img src={`${API_URL}/uploads/${kycDetails.frontView}`} alt="" className="rounded-lg" />
                        </div> }
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2">Back Side</div>

                        <div className="border border-gray-400 w-40 p-2 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" onClick={()=>{
                            if(!backViewClicked){
                                setBackViewClicked(true)
                            }
                            else{
                                setBackViewClicked(false);
                            }
                        }}>
  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
</svg>
                        </div>
                       </div>
                       { backViewClicked && <div className="bg-gray-400 p-6 mx-6 my-4  rounded-lg">
                            <img src={`${API_URL}/uploads/${kycDetails.backView}`} alt="" className="rounded-lg" />
                        </div> }
                       <div className="flex">
                        <div className="border border-gray-400 w-40 p-2">Verify Status</div>
                        <div className="border border-gray-400 w-40 p-2 flex justify-center">
                            <div className={` ${kycDetails.status === "pending" ?"bg-red-500":"bg-green-500" } py-1 px-4 text-white rounded-md`}>{kycDetails.status === "pending" ?"Pending":"Verified"}</div>
                        </div>
                       </div>
                       </div>
                       <div className="px-1 pb-10">
                       </div>
                       {rejectClicked && <div className="bg-gray-400 p-10 rounded-lg shadow-xl top-60 absolute w-80 m-6">
                        
                        <textarea
        className="w-full border border-gray-300 p-2 rounded resize-none break-words whitespace-normal"
        rows={4}
        placeholder="Type your text here..." onChange={(e)=>{
            setReason(e.target.value)
        }}
      ></textarea>
                            <div className="bg-blue-500 text-center p-2 text-white font-bold mt-2 rounded-lg" onClick={()=>{
                                handleReject();
                                navigate('/admin/pendingKyc')
                            }}>sent</div>
                            <div className="bg-gray-500 text-center p-2 text-white font-bold mt-2 rounded-lg " onClick={()=>{
                                setRejectClicked(false);
                            }}>cancel</div>
                        </div>}
                   </div>
                  
                </div>
    )
}