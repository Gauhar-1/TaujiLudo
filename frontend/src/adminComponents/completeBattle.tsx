import { StickyTable } from "../utils/completeBTable";
import { Trophy, CheckCircle2, History, Archive } from "lucide-react";

export const CompleteBattle = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER HUD */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Archive
                    </h1>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">
                        Settled Matches
                    </p>
                </div>
                
                {/* Visual indicator of "Settled" state */}
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        RECONCILED
                    </span>
                </div>
            </div>

            {/* 2. MAIN CARD CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Result List */}
                <div className="px-6 py-5 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                            <Trophy size={18} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            History Feed
                        </h3>
                    </div>
                    
                    {/* Secondary Archive Icon */}
                    <div className="opacity-30 group hover:opacity-100 transition-opacity">
                        <Archive size={18} />
                    </div>
                </div>

                {/* 3. TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    <StickyTable />
                </div>
            </div>

            {/* 4. ANALYTICS FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <History size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight">
                    Displaying a secure log of all matches where prizes have been disbursed and commissions have been logged to the treasury.
                </p>
            </div>

            {/* Extra padding for fixed mobile nav/pagination HUD */}
            <div className="h-10" />
        </div>
    );
};