import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "../utils/url";
import { History, Wallet, Landmark, Plus, ArrowUpRight, Info, Zap } from "lucide-react";

export const WalletPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cashWon, setCashWon] = useState(0);
  const [token, setToken] = useState(0);
  const { phone } = useUserContext();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      if (!phone) return;

      try {
        const response = await axios.get(
          `${API_URL}/api/auth/findProfile`,
          { params: { phoneNumber: phone } }
        );

        if (response.data) {
          const { cashWon, amount } = response.data[0];
          setCashWon(cashWon);
          setToken(amount);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [phone]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0b0b0d]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-2 border-purple-500 animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f12] min-h-screen w-full max-w-md mx-auto pt-16 pb-24 px-5 text-gray-100 font-sans shadow-2xl">
      
      {/* Transaction History Button */}
      <button 
        onClick={() => navigate('/history')}
        className="w-full bg-[#1a1a1f] border border-white/5 p-4 rounded-2xl flex items-center justify-between group active:scale-95 transition-all mb-8 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 group-hover:bg-blue-500/20 transition-colors">
            <History size={24} />
          </div>
          <div className="text-left">
            <p className="text-sm font-black uppercase tracking-widest text-white">Transaction History</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase">View all your deposits & wins</p>
          </div>
        </div>
        <ArrowUpRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
      </button>

      <div className="space-y-6">
        
        {/* Deposit Cash Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 shadow-[0_15px_30px_rgba(79,70,229,0.3)] border border-white/10 group">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">Available Deposit</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white italic">₹{token}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/deposit')}
                className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-indigo-50 active:scale-90 transition-all flex items-center gap-2"
              >
                <Plus size={16} strokeWidth={3} /> Add Cash
              </button>
            </div>
            
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-3 rounded-xl">
              <Info size={14} className="text-indigo-200 shrink-0" />
              <p className="text-[10px] font-medium text-indigo-50 leading-tight">
                Use this to play Tournaments & Battles. Non-withdrawable balance.
              </p>
            </div>
          </div>
          {/* Background Decorative Element */}
          <Wallet className="absolute -right-6 -bottom-6 text-white/10 rotate-12" size={120} />
        </div>

        {/* Winning Cash Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 shadow-[0_15px_30px_rgba(16,185,129,0.3)] border border-white/10 group">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-1">Winning Balance</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white italic">₹{cashWon}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/withdraw')}
                className="bg-black/30 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-black/50 active:scale-90 transition-all flex items-center gap-2"
              >
                <Landmark size={16} /> Withdraw
              </button>
            </div>
            
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-3 rounded-xl">
              <Zap size={14} className="text-emerald-200 shrink-0" />
              <p className="text-[10px] font-medium text-emerald-50 leading-tight">
                Withdraw directly to your Bank or UPI instantly.
              </p>
            </div>
          </div>
          {/* Background Decorative Element */}
          <Trophy className="absolute -right-6 -bottom-6 text-white/10 -rotate-12" size={120} />
        </div>

      </div>

      {/* Safety Note */}
      <div className="mt-10 text-center">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
          <ShieldCheck size={14} /> 100% Secure & Encrypted Payments
        </p>
      </div>

    </div>
  );
};

// Internal sub-icons for the decorative background
const Trophy = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V18"/><path d="M14 22V18"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4Z"/>
    </svg>
);

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
);