import { useNavigate } from "react-router-dom"

export const Footer =(props : any)=>{
    const navigate = useNavigate();
    return (
        <div className="fixed left-0 bottom-0  w-96 z-50">
        {props.login && <div className="bg-yellow-500  flex justify-between px-6 py-2">
            <img src="../../home.png" alt="." className="size-6 hover:bg-yellow-600" onClick={()=>{
                navigate("/");
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