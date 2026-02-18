import { StickyTable } from "../utils/disputeBTable";
import { Gavel, AlertTriangle, ShieldAlert } from "lucide-react";

export const DisputeBattle = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. URGENT HEADER HUD */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Gavel
                    </h1>
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1">
                        Active Disputes
                    </p>
                </div>
                
                {/* Visual indicator of "Action Required" state */}
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                        PENDING VERDICT
                    </span>
                </div>
            </div>

            {/* 2. INVESTIGATION CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-red-500/10 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Dispute List */}
                <div className="px-6 py-5 bg-gradient-to-br from-red-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <Gavel size={18} className="text-red-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Case Directory
                        </h3>
                    </div>
                    
                    {/* Secondary Alert Icon */}
                    <div className="opacity-40 group hover:opacity-100 transition-opacity">
                        <ShieldAlert size={18} className="text-red-500" />
                    </div>
                </div>

                {/* 3. TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    {/* This is where your redesigned StickyTable with Red cards will live */}
                    <StickyTable />
                </div>
            </div>

            {/* 4. MODERATOR FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight">
                    Attention: Judgments made here are final and result in immediate fund disbursement. Review screenshot evidence thoroughly before issuing a verdict.
                </p>
            </div>

            {/* Extra padding for fixed mobile nav/pagination HUD */}
            <div className="h-10" />
        </div>
    );
};