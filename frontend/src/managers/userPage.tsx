import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { Route, Routes } from "react-router-dom";
import { Footer } from "../components/footer";
import { HomePage } from "../components/homePage";
import { ProfilePage } from "../components/profilePage";
import { WalletPage } from "../components/walletPage";
import { HistoryPage } from "../components/historyPage";
import { LoginPage } from "../components/loginPage";
import { DepositPage } from "../components/depositPage";
import { WithdrawPage } from "../components/withdrawPage";
import { WithdrawToBank } from "../components/withdrawToBank";
import { WithdrawToUPI } from "../components/withdrawToUPI";
import { SupportPage } from "../components/supportPage";
import { BattlePgage } from "../components/battlePage";
import { RulesPgage } from "../components/rulesPage";
import { GameHistory } from "../components/GameHistory";
import { AdminPage } from "./adminPage";
import { DashBoard } from "../adminComponents/dashBoard";
import { AdminHeader } from "../adminComponents/adminheader";
import { AllPlayers } from "../adminComponents/allPlayers";


export const UserPage = ()=>{

    const [login , setLogin] = useState(true);
      const [phoneNumber , setPhoneNumber] = useState(0);
      const [ name , setName] =useState("");
      const [amount , setAmount] = useState(5);
      const [userId, setUserId] = useState<string>('');
      const [battleId, setBattleId] = useState("");
      const [ adminclicked , setAdminClicked ] = useState(false);

    useEffect(()=>{
        if ( !phoneNumber || !amount) {
          return console.log( 'All fields are required.' + " " + phoneNumber + " " + amount);
        }
        const updateAmount = async()=>{
          try{
            const  response = await axios.post("http://localhost:3000/api/auth/update-Amount",  { phoneNumber,amount });
            if(response && response.data && response.data.success){
              console.log("Amount updated")
            }
            else{
              console.log("Failed to update Amount")
              console.log(response.data);
            }
    
            const profile = response.data;
            setAmount(profile.amount);
            setUserId(profile.userId);
            console.log("Userid: "+ userId);
            setName(profile.name);8
          }
          catch(err){
             console.log("Error" + err);
          }
    
          }
    
        if (amount > 0) { 
          updateAmount();
        }
      },[]);
  
    return (
        <div>
            { !adminclicked && <Header login={login} amount={amount} setAdminClicked={setAdminClicked}></Header>}
       <Routes>
            <Route path="/home" element={<HomePage name={name} setBattleId={setBattleId} />}></Route>
           <Route path="/" element={<ProfilePage setLogin={setLogin} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>}></Route>
           <Route path="/wallet" element={<WalletPage/>}></Route>
           <Route path="/history" element={<HistoryPage/>}></Route>
           <Route path="/login" element={<LoginPage setLogin={setLogin}  setPhoneNumber={setPhoneNumber} setUserId={setUserId} />}></Route>
           <Route path="/deposit" element={<DepositPage amount={amount} setAmount={setAmount} userId={userId}  />}></Route>
           <Route path="/withdraw" element={<WithdrawPage />}></Route>
           <Route path="/withdrawToBank" element={<WithdrawToBank amount={amount} setAmount={setAmount} userId={userId} />}></Route>
           <Route path="/withdrawToUPI" element={<WithdrawToUPI amount={amount} setAmount={setAmount} userId={userId} />}></Route>
           <Route path="/support" element={<SupportPage/>}></Route>
           <Route path="/battle" element={<BattlePgage battleId={battleId} />}></Route>
           <Route path="/rules" element={<RulesPgage/>}></Route>
           <Route path="/gameHistory" element={<GameHistory userId={userId}/>}></Route>
           <Route path="/admin" element={<AdminPage />}>
                  <Route index element={<DashBoard />}></Route>
                  <Route path="allPlayers" element={<AllPlayers />}></Route>
           </Route>
       </Routes>
     { !adminclicked && <Footer login={login}></Footer> }
        </div>
    )
}