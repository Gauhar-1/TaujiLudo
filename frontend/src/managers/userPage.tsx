import { Header } from "../components/header";
import { Route, Routes} from "react-router-dom";
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
import { BattlePage } from "../components/battlePage";
import { RulesPgage } from "../components/rulesPage";
import { GameHistory } from "../components/GameHistory";
import { AdminPage } from "./adminPage";
import { DashBoard } from "../adminComponents/dashBoard";
import { AllPlayers } from "../adminComponents/allPlayers";
import { WinCashPage } from "../components/winCashPage";
import { useUserContext } from "../hooks/UserContext";
import { TransactionHistory } from "../adminComponents/transaction";
import { BlockedPlayer } from "../adminComponents/blockedPlayers";
import { PendingBattle } from "../adminComponents/pendingBattle";
import { RunningBattle } from "../adminComponents/runningBattle";
import { CompleteBattle } from "../adminComponents/completeBattle";
import { DisputeBattle } from "../adminComponents/disputeBattle";
import { BattleResult } from "../adminComponents/viewResult";
import { DisputeResult } from "../adminComponents/dispute";
import { AllPayments } from "../adminComponents/allPayments";
import { ReqPayments } from "../adminComponents/reqPayments";
import { PaymentRequest } from "../adminComponents/paymentReq";
import { RechargeUser } from "../adminComponents/rechargeUser";
import { MoneyRecharge } from "../adminComponents/moneyRecharge";
import { PendingKyc } from "../adminComponents/pendingKyc";
import { KycVerification } from "../adminComponents/kycVerify";
import { VerifiedKyc } from "../adminComponents/verifiedKyc";
import { ReferPage } from "../components/referPage";
import { PaymentSettings } from "../adminComponents/paymentSettings";
import { AdminSettings } from "../adminComponents/adminSettings";
import { AdminNotification } from "../adminComponents/adminNotification";
import { Notifications } from "../components/notification";
import { RedeemEarnings } from "../components/redeemEarning";
import { useEffect } from "react";
// import { ErrorPage } from "../components/errorPage";
// import axios from "axios";
// import { API_URL } from "../utils/url";


export const UserPage = ()=>{

      // const { login  } = useUserContext();
      // const navigate = useNavigate();

      const { adminClicked } = useUserContext();

      // useEffect(()=>{
      //   if(login === true){
      //     navigate('/winCash')
      //   }
      // },[login])

      // const [isServerUp, setIsServerUp] = useState(false);

      // useEffect(() => {

      //   const checkServerHealth = async () => {
      //     if(isServerUp){
      //       return console.log("Server is up");
      //     }
      //     try { 
      //       const response = await axios.get(`${API_URL}/api/auth/health`);
           
      //       const { status } = response.data;

      //       if (!status) throw new Error("Server down");
      //       setIsServerUp(true);
      //     } catch (error) {
      //       console.log("Error: "+ error);
      //       setIsServerUp(false);
      //     } 
      //   };
    
      //   // Check every 5 seconds
      //   const interval = setInterval(checkServerHealth, 5000);
      //   checkServerHealth(); // Check immediately on load
    
      //   return () => clearInterval(interval);
      // }, []);

      useEffect(() => {
        document.title = "taujiLudo"; // Change tab title
      
        const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = "logo.png"; // Replace with your favicon path
        }
      
      }, []);
      

  // If server is down, show the error page
  // if (!isServerUp) {
  //   return <ErrorPage />;
  // }

  return (
    <div className="flex justify-center">
      {!adminClicked && <Header />}
    <div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/withdrawToBank" element={<WithdrawToBank />} />
        <Route path="/withdrawToUPI" element={<WithdrawToUPI />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/rules" element={<RulesPgage />} />
        <Route path="/refer" element={<ReferPage />} />
        <Route path="/gameHistory" element={<GameHistory />} />
        <Route path="/winCash" element={<WinCashPage />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/referalEarning" element={<RedeemEarnings />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<DashBoard />} />
          <Route path="allPlayers" element={<AllPlayers />} />
          <Route path="allPlayers/transaction" element={<TransactionHistory />} />
          <Route path="blocked" element={<BlockedPlayer />} />
          <Route path="pendingBattle" element={<PendingBattle />} />
          <Route path="runningBattle" element={<RunningBattle />} />
          <Route path="completeBattle" element={<CompleteBattle />} />
          <Route path="disputeBattle" element={<DisputeBattle />} />
          <Route path="viewResult" element={<BattleResult />} />
          <Route path="disputeResult" element={<DisputeResult />} />
          <Route path="allPayments" element={<AllPayments />} />
          <Route path="reqPayments" element={<ReqPayments />} />
          <Route path="paymentReq" element={<PaymentRequest />} />
          <Route path="rechargeUser" element={<RechargeUser />} />
          <Route path="addMoney" element={<MoneyRecharge />} />
          <Route path="pendingKyc" element={<PendingKyc />} />
          <Route path="verifiedKyc" element={<VerifiedKyc />} />
          <Route path="pendingKyc/kycView" element={<KycVerification />} />
          <Route path="paymentSettings" element={<PaymentSettings />} />
          <Route path="adminSettings" element={<AdminSettings />} />
          <Route path="adminNotification" element={<AdminNotification />} />
        </Route>
      </Routes>
    </div>
      {!adminClicked && <Footer />}
    </div>
  );
    
}