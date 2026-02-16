import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { SideBar } from "./sideBar";
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "../utils/url";
import { Menu, Wallet, Trophy, Plus, LogIn } from "lucide-react";

export const Header = () => {
  const [sidebarClicked, setSidebarClicked] = useState(false);
  const [earnings, setEarnings] = useState(false);
  const navigate = useNavigate();
  const { login, phone, amount, setAmount, setUserId, setName, setPhone, setPhoneNumber, setLogin } = useUserContext();

  // ... (Auth Logic remains identical) ...
  useEffect(() => {
    const checkAuth = async () => {
      if (!login) {
        navigate('/')
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        if (response.data.success) {
          const userData = response.data.user;
          setUserId(userData.userId);
          setName(userData.name);
          setPhoneNumber(userData.phoneNumber);
          setPhone(userData.phoneNumber);
          setLogin(true);
        }
      } catch (err: any) {
        console.error("User not logged in", err.response?.status);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!phone) return;
    const updateAmount = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/update-Amount`, { params: { phoneNumber: phone }, withCredentials: true });
        if (response?.data?.success) {
          setAmount(response.data.profile.amount);
          setEarnings(response.data.profile.totalUserReferalEarning);
        }
      } catch (err) { console.log("Error" + err); }
    };
    updateAmount();
  }, [phone]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-2 pt-2 pointer-events-none">
      <div className="w-full max-w-sm bg-[#16161a]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto overflow-hidden">
        
        {login ? (
          <div className="flex items-center justify-between px-3 py-2">
            {/* Left Section: Menu & Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarClicked(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
              >
                <Menu size={22} />
              </button>
              <img 
                src="../../logo.png" 
                alt="Logo" 
                className="h-7 w-auto object-contain cursor-pointer active:scale-95 transition-transform"
                onClick={() => navigate('/winCash')}
              />
            </div>

            {/* Right Section: Wallets */}
            <div className="flex items-center gap-2">
              {/* Cash Wallet */}
              <div className="flex items-center bg-[#1f1f25] border border-white/5 rounded-full pl-1 pr-1 py-1 shadow-inner">
                <div className="bg-gradient-to-tr from-yellow-500 to-amber-300 p-1 rounded-full shadow-lg">
                  <Wallet size={12} className="text-black" />
                </div>
                <span className="text-[11px] font-black px-2 text-amber-500">
                  ₹{amount}
                </span>
                <button 
                  onClick={() => navigate('wallet')}
                  className="bg-green-500 hover:bg-green-400 text-black rounded-full p-1 shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all active:scale-90"
                >
                  <Plus size={14} strokeWidth={4} />
                </button>
              </div>

              {/* Earnings Wallet */}
              <div 
                onClick={() => navigate('/referalEarning')}
                className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-1.5 cursor-pointer hover:bg-purple-500/20 transition-all"
              >
                <Trophy size={12} className="text-purple-400 mr-1" />
                <div className="flex flex-col leading-none">
                    <span className="text-[8px] text-purple-300 font-bold uppercase tracking-tighter">Earnings</span>
                    <span className="text-[10px] font-black text-white">₹{earnings || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Logged Out State */
          <div className="flex justify-between items-center px-4 py-3">
            <img src="../../logo.png" alt="Logo" className="h-7" />
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
            >
              LOGIN <LogIn size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {sidebarClicked && (
        <div className="fixed inset-0 z-[60]">
            <SideBar setSidebarClicked={setSidebarClicked} />
        </div>
      )}
    </header>
  );
};