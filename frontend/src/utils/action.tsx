import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "./url";

export const Transaction = (props : any)=>{
    const navigate = useNavigate();
    const { setId , setPhoneNumber } =useUserContext();



    return <div className="bg-blue-500 rounded-md w-8 p-1" onClick={()=>{
        setId(props.userId);
        setPhoneNumber(props.phoneNumber);
        navigate('transaction');
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
</svg>
    </div>
}
export const KycView = (props : any)=>{
    const navigate = useNavigate();
    const {  setPhoneNumber } = useUserContext();



    return <div className="bg-blue-500 rounded-md w-16 text-center text-white p-2" onClick={()=>{
        setPhoneNumber(props.phoneNumber)
        navigate('/admin/pendingKyc/kycView');
    }}>View</div>
}

export const Accept = ()=>{
    return <div className="bg-green-400 p-1 rounded-md" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
</svg>

    </div>
}

export const Blockplayer = (props : any)=>{
    const blockPlayer = async()=>{
        if(!props.userId){
            console.log("UserId not found", props.userId)
        }
        try{
            const response = await axios.post(`${API_URL}/api/auth/blockPlayer`,{userId: props.userId});

            if(!response.data){
                console.log("Response not found");
            }
        }
        catch(err){
         console.log("Error: " + err);
        }
    }
    return <div className="bg-red-500 p-1 rounded-md" onClick={()=>{
        blockPlayer();
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
</svg>

    </div>
}

export const UnBlock = (props: any)=>{
    const handleUnBlock = async ()=>{

        try{
            const response = await axios.post(`${API_URL}/api/auth/unblockPlayer`,{userId: props.userId});

            if(!response.data){
                return console.log("Response not found", response.data);
            }
        }
        catch(err){
            console.log("Error: "+ err);
        }
    }
    return (
        <div className="bg-red-500 p-2 rounded-lg text-white" onClick={handleUnBlock}>UnBlock</div>
    )
}

export const DeleteBattle = (props : any)=>{
    const handleDelete = async ()=>{

        try{
            const response = await axios.post(`${API_URL}/api/auth/deleteBattle`,{battleId: props.battleId});

            if(!response.data){
                return console.log("Response not found", response.data);
            }
        }
        catch(err){
            console.log("Error: "+ err);
        }
    }
    return (
        <div className="bg-red-500 p-2 rounded-lg text-white" onClick={handleDelete} >Delete</div>
    )
}

export const ViewResult = ( props : any)=>{

    const navigate = useNavigate();
    const { setBattleId, setId, userId } = useUserContext();

    
    return (
        <div className="bg-green-300 p-2 rounded-lg font-bold" onClick={()=>{
        setId(userId)
        setBattleId(props.battleId);
       navigate('/admin/viewResult');
       
    }}>View</div>
  )
}
export const DisputeResult = ( props : any)=>{

    const navigate = useNavigate();
    const { setBattleId } = useUserContext();

  return (
    <div className="bg-green-300 p-2 rounded-lg font-bold" onClick={()=>{
        setBattleId(props.battleId);
       navigate('/admin/disputeResult');
       
    }}>View</div>
  )
}
export const PaymentReq = ( props : any)=>{

    const navigate = useNavigate();
    const { setPaymentId } = useUserContext();

  return (
    <div className="bg-green-300 p-2 rounded-lg font-bold" onClick={()=>{
        setPaymentId(props.battleId);
       navigate('/admin/paymentReq');
       
    }}>View</div>
  )
}

export const AddMoney = (props : any)=>{
    const navigate = useNavigate();
    const profile = props.profile;

  return (
    <div className="bg-green-500 p-2 rounded-lg font-bold text-white" onClick={()=>{
       navigate('/admin/addMoney', {state : { profile}});
       
    }}>Add Money +</div>
  )
}