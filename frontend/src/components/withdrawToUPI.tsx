import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { ArrowLeft, Send, IndianRupee, Wallet, AlertCircle, Zap } from "lucide-react";
import { toast } from "react-toastify";

export const WithdrawToUPI = () => {
    const [token, setToken] = useState(0);
    const [upiId, setUpiId] = useState("");
    const [message, setMessage] = useState("");
    const [balanceLess, setBalanceLess] = useState(false);
    const { userId, amount, phone, setAmount } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleWithdraw = async () => {
        if (!upiId) return toast.error("Please enter a valid UPI ID");
        if (token < 150) return toast.error("Minimum withdrawal is ₹150");

        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/api/auth/withdraw`, {
                userId,
                phoneNumber: phone,
                amount: token,
                wallet: amount - token,
                paymentMethod: 'upi',
                destinationDetails: upiId
            });

            const { success, message } = response.data;
            if (success === false) {
                setMessage(message);
                setBalanceLess(true);
                return;
            }
            setAmount(amount - token);
            toast.success("Withdrawal Request Submitted!");
            navigate('/wallet');
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Something went wrong");
            setBalanceLess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100 overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-violet-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-64 h-64 bg-green-600/10 rounded-full blur-[100px]" />

            {/* Header */}
            <div className="relative z-10 px-6 pt-12 flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic tracking-tight uppercase">UPI Payout</h1>
            </div>

            <div className="relative z-10 px-6 space-y-6">
                
                {/* Balance Info Card */}
                <div className="bg-[#16161a] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                            <Wallet size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Available for payout</span>
                    </div>
                    <span className="text-lg font-black text-white italic">₹{amount}</span>
                </div>

                {/* Main Form Card */}
                <div className="bg-[#16161a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        
                        {/* UPI ID Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-1">
                                <Send size={12} /> Enter UPI ID
                            </label>
                            <input 
                                type="text" 
                                disabled={isLoading} 
                                placeholder="example@upi"
                                className="w-full bg-[#1f1f25] border border-white/5 focus:border-violet-500 outline-none rounded-2xl py-4 px-5 text-white font-bold transition-all placeholder:text-gray-700"
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-widest flex items-center gap-1">
                                <IndianRupee size={12} /> Amount to Withdraw
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-violet-500 italic">₹</span>
                                <input 
                                    type="number" 
                                    disabled={isLoading} 
                                    placeholder="0"
                                    className="w-full bg-[#1f1f25] border border-white/5 focus:border-violet-500 outline-none rounded-2xl py-4 pl-12 pr-5 text-2xl font-black text-white transition-all placeholder:text-gray-700"
                                    onChange={(e) => setToken(parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[9px] text-gray-600 font-bold uppercase">Min: ₹150</span>
                                <span className="text-[9px] text-gray-600 font-bold uppercase">Processing: 0%</span>
                            </div>
                        </div>

                        {/* Withdraw Button */}
                        <button 
                            disabled={isLoading || token < 150}
                            onClick={handleWithdraw}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all active:scale-95 shadow-[0_10px_20px_rgba(139,92,246,0.2)] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Confirm Payout <Zap size={16} fill="currentColor" /></>
                            )}
                        </button>
                    </div>
                    
                    {/* Decorative Background Icon */}
                    <Send className="absolute -right-10 -bottom-10 text-white/5 rotate-12" size={180} />
                </div>

                {/* Safety Instruction */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-3">
                    <AlertCircle size={18} className="text-gray-500 shrink-0" />
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                        Double check your UPI ID before confirming. We are not responsible for transfers made to incorrect IDs. Funds arrive in 5-10 minutes.
                    </p>
                </div>
            </div>

            {/* ERROR MODAL */}
            {balanceLess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
                    <div className="bg-[#1a1a1f] w-full max-w-xs rounded-[2.5rem] p-8 border border-red-500/20 shadow-2xl text-center animate-slide-up">
                        <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-black uppercase mb-2">Insufficient Funds</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mb-8">{message}</p>
                        <button 
                            className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                            onClick={() => setBalanceLess(false)}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* FULLSCREEN LOADING */}
            {isLoading && !balanceLess && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b0b0d]/60 backdrop-blur-sm">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full border-t-2 border-violet-500 animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-500 animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    );
};