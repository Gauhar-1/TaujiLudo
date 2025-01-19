import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProfilePage = (props : any)=>{

    const [ state , setState ] = useState({
            phoneNumber : 0,
            userName : "",
            email : "",
            editClicked : false
    });

   

   
 

    const [editClicked , setEditClicked] = useState(false);
    const [userName ,setUserName] =useState("");
    const [email ,setEmail] =useState("");
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState<number>(props.phoneNumber) 

    useEffect(()=>{
        const getState = async()=>{
            
            try{
                console.log("State field : "+phoneNumber +" " + userName +" " + email +" " + editClicked);
    
                const state = await axios.post('http://localhost:3000/api/auth/createState' , {  phoneNumber, userName, email, editClicked });
    
                if(!state){
                    console.log("State not found");
                }
                if(state)
    
                setState(state.data);
                setUserName(state.data.userName);
                setPhoneNumber(state.data.phoneNumber);
                setEditClicked(state.data.editClicked);
                setEmail(state.data.email);
            }
            catch(err){
                console.log("Error: "+ err);
            }
    
        }
        getState();
    
    },[phoneNumber, userName, email, editClicked]);

    useEffect(()=>{
        const getProfile = async()=>{
                if (phoneNumber) {
                  console.log("Phone number "+ phoneNumber);
                }
                

            try{const response = await axios
            .get("http://localhost:3000/api/auth/new-profile",  { params: { phoneNumber }})
            if(response.data.success){
                console.log("profile created 1");
            }
            else{
                console.log("failed to create profile")
            }
            
            props.setPhoneNumber(response.data.phoneNumber);
            console.log("PhoneNumber :" + props.phoneNumber);
            setPhoneNumber(response.data.phoneNumber);
            setUserName(response.data.name);
            setEmail(response.data.email);

          
        }
            catch(err){
                console.log("Error: "+ err);
            }
           
        }

       

        getProfile();
       
    },[phoneNumber]);

    

    const updateProfile = async()=>{

        if (!userName || !phoneNumber || !email) {
            return console.log( 'All fields are required.' + name + " " + phoneNumber + " " + email);
          }
            const response = await axios
            .post("http://localhost:3000/api/auth/update-Profile",  { phoneNumber,name :userName, email });
            
            if(response.data.success){
                console.log("updated profile Successfully");
            }
            else{
                console.log("failed to update profile");
                console.log(response.data);
            }
    }
    return ( 
    <div className=" ">
        <div className="flex flex-col left-0 inset-y-0 pt-12">
      <div className="bg-gray-200 max-w-sm  min-h-screen">
        {editClicked && <div className="absolute bg-gray-300 rounded-lg top-60 left-16 w-60 z-40 p-4 ">
            <div className="flex justify-end font-bold " onClick={()=>{
                setEditClicked(false);
            }}>X</div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs">Enter the username:</div>
            <input type="text" className="rounded-md p-1" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/>
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
            <div className="m-5 bg-gray-600 rounded-xl flex flex-col hover:bg-gray-700 ">
                <div className="flex">
                <img src="../../profile.png" alt=""  className="h-32  p-3"/>
                <div className="text-white text-3xl font-serif mx-6 my-10" >{userName}</div>
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
                    <div className="text-white font-semibold text-sm">{phoneNumber}</div>
                    </div>
                    <div className="text-white font-semibold col-start-6 text-sm  ">{email}</div>
                </div>
            </div>
            <div className="flex justify-around m-4">
                <div className="bg-gray-100 h-16 w-40 rounded-md relative z-30 hover:bg-gray-700  font-bold">
                    <img src="../../wallet.png" alt="" className="size-7 absolute top-0 left-16 mt-2   " />
                    <div className="absolute top-8 left-10 mt-1">My Wallet</div>
                </div>
                <div className="bg-gray-100  rounded-md h-16 w-40 relative hover:bg-gray-700 ">
                    <img src="../../kyc.png" alt=""  className="size-7 absolute top-0 left-16 mt-2 " />
                    <div className="absolute top-8 left-6 mt-1 font-bold">Kyc completed</div>
                </div>
            </div>
                <div className="flex justify-around m-8">
                    <div className="">
                        <div className="relative bg-gray-100 h-32 w-20 rounded-md  hover:bg-green-500">
                        <img src="../../cash.png" alt="" className="size-8 absolute left-7 top-4"/>
                        <div className="font-bold text-black absolute left-8 top-20">0</div>
                        </div>
                        <div className="font-thin text-xs text-center p-2">cash won</div>
                    </div>
                    <div>
                    <div className="bg-gray-100 h-32 w-20 rounded-md  relative hover:bg-green-500">
                        <img src="../../battle.png" alt="" className="size-8 absolute left-7 top-4"/>
                        <div className="font-bold text-black absolute left-8 top-20">0</div>
                    </div>
                    <div className="font-thin text-xs text-center p-2">Battle Played</div>
                    </div>
                    <div>
                    <div className="bg-gray-100 h-32 w-20 rounded-md  relative hover:bg-green-500">
                        <img src="../../referal.png" alt="" className="size-8 absolute left-7 top-4"/>
                        <div className="font-bold text-black absolute left-8 top-20">0</div>
                    </div>
                    <div className="font-thin text-xs text-center py-2">Referal Earnings</div>
                    </div>
                </div>
                <div className="mt-16 ">
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