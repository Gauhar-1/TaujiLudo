import { useState } from "react";
import { StickyTable } from "../utils/rechargeTable";
import { useUserContext } from "../hooks/UserContext";
import { Search, Wallet, UserSearch, ArrowRight, Zap, Info } from "lucide-react";

export const RechargeUser = () => {
    const { setPhoneNumber } = useUserContext();
    const [searchClicked, setSearchClicked] = useState(false);

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER SECTION */}
            <div className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Terminal
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Manual Recharge
                    </p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5">
                    <Wallet size={20} className="text-amber-500" />
                </div>
            </div>

            {/* 2. SEARCH CONSOLE */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                        <UserSearch size={18} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Find Player</h3>
                </div>

                <div className="space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Name, Phone, or UserID" 
                            className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
                            onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                if(e.target.value === "") setSearchClicked(false);
                            }}
                        />
                    </div>

                    <button 
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-amber-500/10"
                        onClick={() => setSearchClicked(true)}
                    >
                        Initialize Search <ArrowRight size={16} />
                    </button>
                </div>

                {/* Background Decoration */}
                <Zap className="absolute -right-6 -bottom-6 text-white/[0.02] -rotate-12" size={120} />
            </div>

            {/* 3. RESULTS AREA */}
            {searchClicked ? (
                <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Search Results</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="px-1 pb-10">
                        <StickyTable />
                    </div>
                </div>
            ) : (
                /* EMPTY STATE TIP */
                <div className="mt-12 px-10 text-center opacity-30">
                    <Info size={32} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                        Enter player credentials above to access the recharge terminal. 
                        Ensure the UserID is exact for fast results.
                    </p>
                </div>
            )}

            {/* Bottom spacer for fixed pagination */}
            <div className="h-10" />
        </div>
    );
}