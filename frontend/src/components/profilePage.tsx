import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { toast } from "react-toastify";

export const ProfilePage = ()=>{

    const [editClicked, setEditClicked] = useState(false);
    const [ kycClicked, setKycClicked ] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
    const [email, setEmail] = useState( () => localStorage.getItem("email") ||  "@gmail.com");
    const navigate = useNavigate();
    const { name, setName, phone, userId, setPhone , setUserId, setLogin, setPhoneNumber } = useUserContext();
    const [ Name , setname ] = useState("")
    const [ DOB , setDOB ] = useState("")
    const [ state , setState ] = useState("")
    const [ documentNumber , setDocumentNumber ] = useState("")
    const [ kycStatus , setKycStatus ] = useState("")
    const [ earnings , setEarnings ] = useState(0)
    const [ cashWon , setCashWon ] = useState(0)
    const [ battlePlayed , setBattlePlayed ] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

  
    // Get phoneNumber from location state or fallback
    
        
  
    useEffect(() => {
      const fetchProfile = async () => {
        setIsLoading(true);
        if (!phone) {
          console.log("Phone number (Profile): "+ phone);
          return;
        }
  
        try {
          const response = await axios.get(
            `${API_URL}/api/auth/findProfile`,
             { params :{ phoneNumber : phone }} 
          );
  
          if (response.data) {
            const {phoneNumber, name, email, userId, kycDetails, totalUserReferalEarning, gameWon, cashWon, gameLost } = response.data[0];
            setName(name );
            setEmail(email );
            setPhone(phoneNumber);
            setName(name);
            setUserId(userId);
            setKycStatus(kycDetails.status);
            setEarnings(totalUserReferalEarning);
            setCashWon(cashWon);
            setBattlePlayed(gameWon + gameLost);
            console.log("Profile fetched successfully.");
          } else {
            console.warn("Failed to fetch profile.");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
        finally{
          setIsLoading(false);
        }
      };
  
      fetchProfile();
    }, []);
  
    const updateProfile = async () => {
      setIsLoading(true);
      if (!name || !phone || !email) {
        console.error("All fields are required:", { name, phone, email });
        return;
      }
  
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/update-Profile`,
          { phoneNumber : phone , name, email }
        );
  
        if (response.data.success) {
          console.log("Profile updated successfully.");
        } else {
          console.warn("Failed to update profile.");
        }
      } catch (err) {
        console.error("Error updating profile:", err);
      }
    };

    const uploadScreenshot = async () => {
      if (!selectedFile ||  !selectedFile2 ||  !userId) {
        alert("Please select a file to upload.");
        return;
      }
      if (!Name ||  !DOB ||  !state  ||  !documentNumber) {
        alert("Please Enter all the details first");
        return;
      }
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("image2", selectedFile2);
      formData.append("userId", userId);
      formData.append("Name", Name);
      formData.append("DOB", DOB);
      formData.append("state", state);
      formData.append("documentNumber", documentNumber);

      console.log("Form data:", selectedFile, userId);
      setIsLoading(true);
      try {
          await axios.post(`${API_URL}/api/auth/kyc`, formData);

      } catch (err) {
        console.error("Error uploading screenshot:", err);
      }
      finally{
        setIsLoading(false);
      }
    };

    const handleLogOut = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    
        if (response.data.success) {
          toast.success("Logged out successfully!", { position: "top-right" });
    
          // Clear user state
          setUserId("");
          setName("");
          setPhone("");
          setPhoneNumber("");
          setLogin(false);
    
          // Redirect to login page
          navigate("/");
        } else {
          toast.error("Logout failed. Please try again.", { position: "top-right" });
        }
      } catch (err) {
        console.error("Logout Error:", err);
        toast.error("Something went wrong. Try again!", { position: "top-right" });
      }
      finally{
        setIsLoading(false);
      }
    };
  
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
    <div className="">
        <div className="flex flex-col left-0 inset-y-0 pt-12">
      <div className="bg-gray-200 max-w-sm relative  min-h-screen">
        {editClicked && <div className="absolute bg-gray-300 rounded-lg top-60 left-16 w-60 z-40 p-4 ">
            <div className="flex justify-end font-bold " onClick={()=>{
                setEditClicked(false);
            }}>X</div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs">Enter the username:</div>
            <input type="text" className="rounded-md p-1" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs">Enter the email:</div>
            <input type="text" className="rounded-md p-1" value={email}  onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>
                <button className="bg-green-500 text-center p-1 mt-3 rounded-md text-white" 
                onClick={()=>{
                    setEditClicked(false)
                    updateProfile();
                }}>Save</button>
            </div>
            </div>}
             {/*********** *Kyc upload **************/}
             { kycClicked && <div className="absolute top-20 left-3 z-30  bg-gray-400 p-8 rounded-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-xs">Front View :</div>
                  <input disabled={isLoading}  type="file" id="fileInput" className=" text-center shadow-md  rounded-lg px-2 py-2  w-52 border border-black bg-white  text-sm " onChange={(e)=>{
                    if(e.target.files)
                    setSelectedFile(e.target.files[0])
                }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-xs">Back View :</div>
                  <input disabled={isLoading}   type="file" id="fileInput" className=" text-center shadow-md  rounded-lg px-2 py-2  w-52 border border-black bg-white  text-sm " onChange={(e)=>{
                    if(e.target.files)
                    setSelectedFile2(e.target.files[0])
                }} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs">Enter the Name :</div>
            <input disabled={isLoading}  type="text" className="rounded-md p-1"  onChange={(e)=>{setname(e.target.value)}}/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs"> Date of Birth :</div>
            <input disabled={isLoading}  type="text" className="rounded-md p-1"   onChange={(e)=>{setDOB(e.target.value)}}/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs"> State :</div>
            <input disabled={isLoading}  type="text" className="rounded-md p-1"   onChange={(e)=>{setState(e.target.value)}}/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs"> Aadhar Number :</div>
            <input disabled={isLoading}  type="text" className="rounded-md p-1"   onChange={(e)=>{setDocumentNumber(e.target.value)}}/>
                </div>
                </div>
               
                <button disabled={isLoading}  className="bg-green-400 text-white text-center mt-6 mx-8 p-2 rounded-lg " onClick={()=>{
                  uploadScreenshot();
                  setKycClicked(false);
                }}>Done</button>
                <button disabled={isLoading}  className="bg-gray-500 text-white text-center mt-2 mx-16 p-2 rounded-lg " onClick={()=>{
                  setKycClicked(false);
                }}>back</button>
                </div>}
            <div className="m-5 bg-gray-600 rounded-xl flex flex-col hover:bg-gray-700 ">
                <div className="flex">
                <img src="../../profile.png" alt=""  className="h-32  p-3"/>
                <div className="text-white text-xl w-32 font-serif mx-6 my-10" >{name}</div>
                <div onClick={()=>{
                   setEditClicked(true);
                }}>
                  
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6 mt-11 ">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
                </div>

                </div>
                <div className="grid grid-cols-10 p-1 m-1">
                    <div className="col-start-2 flex gap-1">
                    <img src="../../call-icon.png" alt="" className="h-5 pt-1 "/>
                    <div className="text-white font-semibold text-sm">{phone}</div>
                    </div>
                    <div className="text-white font-semibold col-start-6 text-sm  ">{email}</div>
                </div>
            </div>
            <div className="flex justify-around m-4">
                <div className="bg-gray-100 h-16 w-40 rounded-md relative z-3 hover:bg-gray-400  font-bold" onClick={()=>{
                  navigate('/wallet')
                }}>
                    <img src="../../wallet.png" alt="" className="size-7 absolute top-0 left-16 mt-2" />
                    <div className="absolute top-8 left-10 mt-1">My Wallet</div>
                </div>
                { kycStatus === "pending" &&<div className="bg-red-500  rounded-md h-16 w-40 flex justify-center " onClick={()=>{
                      setKycClicked(true);
                    }}>
                    <div className="absolute text-center py-4  font-bold text-white" >Kyc pending</div>
                </div>}
                { kycStatus === "verified" &&<div className="bg-gray-100  rounded-md h-16 w-40 relative hover:bg-gray-700 ">
                    <img src="../../kyc.png" alt=""  className="size-7 absolute top-0 left-16 mt-2 " />
                    <div className="absolute top-8 left-6 mt-1 font-bold" >Kyc completed</div>
                </div>}

               
            </div>
                <div className="flex justify-around m-8">
                    <div className="">
                        <div className="relative bg-gray-100 h-32 w-20 rounded-md flex flex-col gap-4 hover:bg-green-500">
                          <div className="flex justify-center p-4">
                        <img src="../../cash.png" alt="" className="size-8 "/>
                          </div>
                        <div className="font-bold text-black  px-4 ">{cashWon}</div>
                        </div>
                        <div className="font-thin text-xs text-center p-2">cash won</div>
                    </div>
                    <div>
                    <div className="bg-gray-100 h-32 w-20 rounded-md  flex flex-col gap-4 hover:bg-green-500">
                      <div className="flex justify-center p-4">
                        <img src="../../battle.png" alt="" className="size-8"/>
                      </div>
                        <div className="font-bold text-black  text-center top-20">{battlePlayed}</div>
                    </div>
                    <div className="font-thin text-xs text-center p-2">Battle Played</div>
                    </div>
                    <div>
                    <div className="bg-gray-100 h-32 w-20 rounded-md  flex flex-col gap-4 hover:bg-green-500">
                      <div className="flex justify-center p-4">
                        <img src="../../referal.png" alt="" className="size-8 "/>
                      </div>
                        <div className="font-bold text-black text-center">{earnings}</div>
                    </div>
                    <div className="font-thin text-xs text-center py-2">Referal Earnings</div>
                    </div>
                </div>
                <div className="mt-16 ">
                <div className="absolute w-80 bg-gray-300 text-black rounded-xl p-2 m-8 border border-black text-center hover:cursor-pointer hover:bg-green-500 hover:text-white" onClick={()=>{
                    handleLogOut();
                }}>Log out</div>
                </div>
                
        </div>

        </div>
      </div>
       
    )
}