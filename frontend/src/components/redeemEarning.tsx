import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { ArrowLeft, Gift, Zap, Coins, Info, AlertCircle } from "lucide-react";

export const RedeemEarnings = () => {
    const [token, setToken] = useState(0);
    const [message, setMessage] = useState("");
    const [balanceLess, setBalanceLess] = useState(false);
    const { userId } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleWithdraw = async () => {
        if (token <= 0) return;
        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/api/auth/redeemEarnings`, {
                userId,
                amount: token,
            });

            const { message } = response.data;
            if (message) {
                setMessage(message);
                setBalanceLess(true);
                return;
            }
            navigate('/home');
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Transfer failed");
            setBalanceLess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100 overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />

            <div className="relative z-10 px-6 pt-16">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black italic tracking-tight uppercase">Redeem Rewards</h1>
                </div>

                {/* Main Card */}
                <div className="bg-[#16161a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-emerald-500/10 p-5 rounded-3xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <Gift size={40} className="text-emerald-500" />
                        </div>
                        
                        <h2 className="text-center font-black text-2xl mb-2 tracking-tight">REFERRAL VAULT</h2>
                        <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                            Convert your earnings into playable cash
                        </p>

                        {/* Input Area */}
                        <div className="w-full space-y-2 mb-10">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                                <Coins size={12} /> Amount to Redeem
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-500">₹</span>
                                <input 
                                    disabled={isLoading} 
                                    type="number" 
                                    placeholder="0"
                                    className="w-full bg-[#1f1f25] border-2 border-transparent focus:border-emerald-500 outline-none rounded-2xl py-5 pl-12 pr-4 text-3xl font-black text-white transition-all placeholder:text-gray-800"
                                    onChange={(e) => setToken(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full space-y-4">
                            <button 
                                onClick={handleWithdraw}
                                disabled={isLoading || token <= 0}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-black transition-all active:scale-95 shadow-[0_10px_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                            >
                                {isLoading ? <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Confirm Redemption"}
                            </button>
                        </div>
                    </div>
                    
                    {/* Decorative Icon */}
                    <div className="absolute -right-8 -bottom-8 opacity-5">
                        <Gift size={150} />
                    </div>
                </div>

                {/* Info Note */}
                <div className="mt-8 flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Info size={16} className="text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                        Redeemed earnings are instantly added to your main wallet balance. This balance can be used to join battles but cannot be withdrawn directly back to a bank account.
                    </p>
                </div>
            </div>

            {/* ERROR MODAL */}
            {balanceLess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
                    <div className="bg-[#1a1a1f] w-full max-w-xs rounded-[2rem] p-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center animate-slide-up">
                        <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-black uppercase mb-2">Redemption Error</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mb-8">{message}</p>
                        <button 
                            className="w-full bg-gray-800 hover:bg-gray-700 py-4 rounded-xl font-bold text-sm transition-all"
                            onClick={() => setBalanceLess(false)}
                        >
                            Okay, Got it
                        </button>
                    </div>
                </div>
            )}

            {/* FULLSCREEN LOADING */}
            {isLoading && !balanceLess && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full border-t-2 border-emerald-500 animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    );
};