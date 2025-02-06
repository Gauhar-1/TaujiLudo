import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";


export const DepositPage = ()=>{
    const[token , setToken] = useState<number>(0)
    const [upiId, setUpiId] = useState<string>('');
    const [, setUpiLink] = useState<string>('');
    const [ QR , setQR ] = useState("");
    const [ UPI , setUPI ] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const { userId, amount, setAmount } = useUserContext();

    useEffect(()=>{
        const handleInfoBar = async()=>{
          try{
            const response = await axios.get(`${API_URL}/api/auth/getAdmin`);
            if(!response.data){
              return console.log( "InfoBAr response not found ");
            }
            const { paymentSetting } = response.data.admin[0];
            console.log(paymentSetting);
            console.log(response.data.admin[0]);
            setQR(paymentSetting.QR);
            setUPI(paymentSetting.UPI);
          }
          catch(err){
            console.log("Error: "+ err);
          }
        }
    
        handleInfoBar();
      },[])

    const handleDeposit = async () => {

        if (!selectedFile || !userId) {
            alert("Please select a file to upload.");
            console.log(userId);
            return;
          }
          const formData = new FormData();
          formData.append("image", selectedFile);
          formData.append("userId", userId.toString());
          formData.append("amount", token.toString());
          formData.append("wallet", (amount + token).toString());
          formData.append("paymentMethod",'upi');
          formData.append("upiId",upiId);
  
        //   console.log("Form data:", selectedFile, userId);
        for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
}


        try {
            const response = await axios.post(`${API_URL}/api/auth/deposit`,  formData );
            setUpiLink(response.data.upiLink);
            setAmount( amount + token);
            navigate("/wallet");
        } catch (err : any) {
            console.log('Error initiating deposit: ' + err.response?.data?.message || err.message);
        }
    };
   
    
    return (
        <div className="bg-gray-200 min-h-screen max-w-sm flex flex-col justify-between">
            <div className="relative"> 
            <div className=" absolute   top-16 left-0 px-4 flex flex-col gap-6">
                
            <div className="bg-gray-200 py-4  ">
            <div className=" relative ">
                <div className="  rounded-md bg-gray-300 m-2 ">
                <div className="p-4 w-80 text-center font-serif text-2xl">Deposit via QR</div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="bg-white p-4 w-48 rounded-lg mx-10 mb-2">
                        <img src={`${API_URL}/uploads/${QR}`} alt="" className="size-40" />
                    </div>
                    <div className="flex gap-2">
                        <div className=" text-slate-500 font-bold">UPI Id:</div>
                        <div className="font-semibold">{UPI}</div>
                    </div>
                    <div className=" flex flex-col gap-2 ">
                        <div className="text-sm text-slate-500  font-semibold">Upload screenShot:</div>
                    <input  type="file" id="fileInput" className="text-center shadow-md  rounded-lg px-2 py-2  w-52 border border-black bg-white  text-sm " onChange={(e)=>{
                    if(e.target.files)
                    setSelectedFile(e.target.files[0])
                }} />
                    </div>
                    <div className="text-sm font-semibold text-slate-500">UTR Number</div>
                    <input type="text" className="rounded-md border border-gray-950 py-1 px-2" onChange={(e)=>{
                        setUpiId(e.target.value)
                    }}/>
                 </div>
                 <div className="px-6 py-2 flex flex-col gap-2">
                    <div className="text-sm font-semibold text-slate-500">Amount to Deposit:</div>
                    <input type="text"  className="rounded-md border border-gray-950 py-1 px-2" onChange={(e)=>{
                        const newValue = parseInt(e.target.value);
                        setToken(newValue);
                    }}/>
                    <div className="font-extralight pl-4">Min: 50, Max: 100000</div>
                    <div className="bg-gray-200  top-60 left-10 w-72 h-40 rounded-md p-4 text-sm flex flex-col gap-3 ">
                <div>Deposit Amount (excl. Govt. Tax): ₹ {Math.round(token*((100-28)/100))}</div>
                <div>Govt. Tax (28% GST): ₹ {Math.round(token*((28)/100))}</div>
                <div>Deposit Bonus : ₹ {Math.round(token*((28)/100))}</div>
                <div>Total Payable Amount:  ₹ {token? token : 0}</div>
            </div>
                 </div>
                 <div className="p-2 flex justify-center">
                 <div className=" bg-green-500 h-10 w-64 rounded-md text-center text-white pt-2 mb-2" onClick={()=>{
                    handleDeposit();
                    // uploadScreenshot();
                 }}>Deposit</div>
                 </div>
                 <div className="flex justify-center">
                 <div className="bg-gray-700 w-28 text-center rounded-md p-1 mb-8 text-white" onClick={()=>{
                    navigate('/wallet')
                 }}>back</div>
                 </div>
                </div>
            </div>
        </div>  
            </div>
            </div>
            
        </div>
    )
}