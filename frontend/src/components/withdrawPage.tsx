import { useNavigate } from "react-router-dom";
import { ArrowLeft, Landmark, Send, ChevronRight, ShieldCheck, Zap } from "lucide-react";

export const WithdrawPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100 overflow-hidden">
            
            {/* Background Decorative Glow */}
            <div className="absolute top-[-5%] right-[-10%] w-64 h-64 bg-violet-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-5%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

            {/* Header */}
            <div className="relative z-10 px-6 pt-12 flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic tracking-tight uppercase">Cash Out</h1>
            </div>

            <div className="relative z-10 px-6 space-y-6">
                
                {/* Intro Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-black mb-2 tracking-tight">Choose Payout Method</h2>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed">
                        Select how you would like to receive your winnings. Withdrawals are processed within 5-10 minutes.
                    </p>
                </div>

                {/* Option 1: UPI */}
                <div 
                    onClick={() => navigate('/withdrawToUPI')}
                    className="group relative bg-gradient-to-r from-[#1a1a1f] to-[#25252b] p-5 rounded-[2rem] border border-white/5 shadow-xl cursor-pointer hover:border-violet-500/30 transition-all active:scale-95"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-violet-500/10 p-4 rounded-2xl text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                                <Send size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">UPI Transfer</h3>
                                <div className="flex items-center gap-1.5">
                                    <Zap size={10} className="text-violet-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min. Withdrawal: ₹150</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </div>

                {/* Option 2: Bank Transfer */}
                <div 
                    onClick={() => navigate('/withdrawToBank')}
                    className="group relative bg-gradient-to-r from-[#1a1a1f] to-[#25252b] p-5 rounded-[2rem] border border-white/5 shadow-xl cursor-pointer hover:border-blue-500/30 transition-all active:scale-95"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                <Landmark size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Bank Account</h3>
                                <div className="flex items-center gap-1.5">
                                    <Zap size={10} className="text-blue-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min. Withdrawal: ₹150</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </div>

                {/* Security Badge */}
                <div className="pt-10 flex flex-col items-center gap-4 opacity-50">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <ShieldCheck size={16} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Payout System</span>
                    </div>
                    <p className="text-[9px] text-center text-gray-600 font-medium px-12 leading-tight">
                        Payments are strictly processed to accounts matching your KYC verification details.
                    </p>
                </div>

            </div>
            
            {/* Floating Brand Mark */}
            <div className="absolute -bottom-10 -right-10 opacity-5 select-none pointer-events-none">
                <Landmark size={300} />
            </div>
        </div>
    );
};