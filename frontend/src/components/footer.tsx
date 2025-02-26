import { useNavigate } from "react-router-dom"
import { useUserContext } from "../hooks/UserContext";

export const Footer =()=>{
    const navigate = useNavigate();
    const { login } = useUserContext();
    return (
        <div className="fixed left-0 bottom-0  w-96 z-50">
        {login && <div className="bg-yellow-500  flex justify-between pl-6 pr-8 py-2">
            <img src="../../home.png" alt="." className="size-6 hover:bg-yellow-600" onClick={()=>{
                navigate("/winCash");
            }} />
            <img src="../../wallet.png" alt="." className="size-6 hover:bg-yellow-600" onClick={()=>{
                navigate("/wallet");
            }} />
            <img src="../../user.png" alt="." className="size-6 hover:bg-yellow-600 rounded-2xl" onClick={()=>{
                navigate("/profile");
            }}/>
        </div>}
        </div>
    )
}