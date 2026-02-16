import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";

// User Components
import { Header } from "../components/header";
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
import { WinCashPage } from "../components/winCashPage";
import { ReferPage } from "../components/referPage";
import { Notifications } from "../components/notification";
import { RedeemEarnings } from "../components/redeemEarning";

// Admin Components
import { AdminPage } from "./adminPage";
import { DashBoard } from "../adminComponents/dashBoard";
import { AllPlayers } from "../adminComponents/allPlayers";
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
import { PaymentSettings } from "../adminComponents/paymentSettings";
import { AdminSettings } from "../adminComponents/adminSettings";
import { AdminNotification } from "../adminComponents/adminNotification";

export const UserPage = () => {
  const { adminClicked } = useUserContext();
  const location = useLocation();

  // Update Page Title and Favicon
  useEffect(() => {
    document.title = "TaujiLudo | Play & Win";
    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (favicon) favicon.href = "logo.png";
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0b0b0d] flex justify-center selection:bg-purple-500/30">
      <div className="w-full max-w-md bg-[#0f0f12] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col relative min-h-screen">
        
        {!adminClicked && location.pathname !== "/" && <Header />}

        {/* Content Area */}
        <main className={`flex-1 flex flex-col ${!adminClicked && location.pathname !== "/" ? "pt-8 pb-20" : ""}`}>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/winCash" element={<WinCashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/withdrawToBank" element={<WithdrawToBank />} />
            <Route path="/withdrawToUPI" element={<WithdrawToUPI />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/battle" element={<BattlePage />} />
            <Route path="/rules" element={<RulesPgage />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/gameHistory" element={<GameHistory />} />
            <Route path="/notification" element={<Notifications />} />
            <Route path="/referalEarning" element={<RedeemEarnings />} />

            {/* Admin Routes (Nested) */}
            <Route path="/admin" element={<AdminPage />}>
              {/* <index element={<DashBoard />} /> */}
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
        </main>

        {/* Conditional Footer: Hidden in Admin or Login modes */}
        {!adminClicked && location.pathname !== "/" && <Footer />}
      </div>

      {/* Background Ambience (Desktop only decorative elements) */}
      <div className="hidden lg:block fixed top-1/2 left-10 -translate-y-1/2 opacity-20 select-none">
        <h1 className="text-8xl font-black text-white/5 rotate-90 tracking-tighter">ARENA</h1>
      </div>
      <div className="hidden lg:block fixed top-1/2 right-10 -translate-y-1/2 opacity-20 select-none">
        <h1 className="text-8xl font-black text-white/5 -rotate-90 tracking-tighter">WINNER</h1>
      </div>
    </div>
  );
};