import { Header } from "./components/header";
import { ProfilePage } from "./components/profilePage";
import { Footer } from "./components/footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./components/homePage";
import { WalletPage } from "./components/walletPage";
import { HistoryPage } from "./components/historyPage";
import { LoginPage } from "./components/loginPage";
import { useState } from "react";
import { DepositPage } from "./components/depositPage";
import { WithdrawPage } from "./components/withdrawPage";
import { WithdrawToBank } from "./components/withdrawToBank";
import { WithdrawToUPI } from "./components/withdrawToUPI";
import { SupportPage } from "./components/supportPage";
import { BattlePgage } from "./components/battlePage";

function App() {
  const [login , setLogin] = useState(true);

  return (
    <div className='min-h-screen bg-slate-950'>
    <BrowserRouter>
      <Header login={login}></Header>
       <Routes>
            <Route path="/" element={<HomePage />}></Route>
           <Route path="/profile" element={<ProfilePage setLogin={setLogin} />}></Route>
           <Route path="/wallet" element={<WalletPage/>}></Route>
           <Route path="/history" element={<HistoryPage/>}></Route>
           <Route path="/login" element={<LoginPage setLogin={setLogin} />}></Route>
           <Route path="/deposit" element={<DepositPage />}></Route>
           <Route path="/withdraw" element={<WithdrawPage />}></Route>
           <Route path="/withdrawToBank" element={<WithdrawToBank />}></Route>
           <Route path="/withdrawToUPI" element={<WithdrawToUPI />}></Route>
           <Route path="/support" element={<SupportPage/>}></Route>
           <Route path="/battle" element={<BattlePgage/>}></Route>
       </Routes>
     <Footer></Footer>
    </BrowserRouter>
    </div>
  )
}

export default App
