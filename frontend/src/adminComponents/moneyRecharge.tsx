import { useUserContext } from "../hooks/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/url";
import {  
  User, 
  Phone, 
  ShieldCheck, 
  PlusCircle, 
  ArrowLeft,
  Wallet
} from "lucide-react";

export const MoneyRecharge = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const profile = location.state?.profile;
    const { setAmount, amount } = useUserContext();
    const [loading, setLoading] = useState(false);

    const handleDeposit = async () => {
        if (!amount || amount <= 0) return alert("Please enter a valid amount");
        
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/deposit`, {
                userId: profile.userId,
                amount,
                wallet: (profile.amount + amount),
                paymentMethod: 'admin_recharge',
                upiId: "system_admin",
            });
            
            // UI feedback
            setAmount(0); // Reset context amount
            alert(`Successfully recharged ₹${amount} to ${profile.userId}`);
            navigate(-1); // Go back after success
        } catch (err: any) {
            console.error('Error initiating deposit:', err);
            alert("Transaction failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="bg-[#0b0b0d] min-h-screen text-white p-10 font-black italic uppercase">No Profile Data Found</div>;

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-20 px-6 pb-20 font-sans text-gray-100">
            
            {/* BACK & HEADER */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/5 rounded-2xl text-gray-400 active:scale-90 transition-all border border-white/5"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Recharge
                    </h1>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">
                        Capital Injection
                    </p>
                </div>
            </div>

            {/* USER SNAPSHOT CARD */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{profile.name || "Gamer"}</h3>
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <span className="text-[9px] font-mono tracking-tighter uppercase italic">UID: {profile.userId.slice(-10)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Phone size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Mobile</span>
                        </div>
                        <p className="text-xs font-bold text-gray-300">{profile.phoneNumber}</p>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3">
                        <div className="flex items-center gap-2 text-emerald-500/50 mb-1">
                            <Wallet size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-emerald-500/50">Current Wallet</span>
                        </div>
                        <p className="text-xs font-black text-emerald-500 italic leading-none">₹{profile.amount}</p>
                    </div>
                </div>
                
                {/* Decoration */}
                <ShieldCheck className="absolute -right-4 -bottom-4 text-white/[0.02] -rotate-12" size={100} />
            </div>

            {/* RECHARGE FORM */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="mb-6">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 block mb-3">
                        Enter Recharge Amount
                    </label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xl italic group-focus-within:animate-pulse">
                            ₹
                        </div>
                        <input 
                            type="number" 
                            placeholder="0.00"
                            className="w-full bg-[#0b0b0d] border border-white/5 rounded-3xl py-6 pl-12 pr-6 text-2xl font-black italic text-white placeholder:text-gray-800 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setAmount(isNaN(val) ? 0 : val);
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">New Balance</span>
                        <span className="text-sm font-black text-emerald-500 italic">
                            ₹{profile.amount + (amount || 0)}
                        </span>
                    </div>

                    <button 
                        onClick={handleDeposit}
                        disabled={loading}
                        className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl
                            ${loading 
                                ? "bg-emerald-500/50 text-black cursor-not-allowed" 
                                : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20"
                            }`}
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <PlusCircle size={18} />
                        )}
                        {loading ? "Injecting..." : "Inject Capital"}
                    </button>
                </div>
            </div>

            {/* SAFETY NOTICE */}
            <div className="mt-8 px-6 text-center">
                <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest leading-relaxed">
                    Warning: Manual recharges bypass the automated payment gateway. <br/>
                    Ensure funds are received before deploying capital.
                </p>
            </div>
        </div>
    );
};