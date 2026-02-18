import { StickyTable } from "../utils/pendingBTable";
import { Sword, Clock, LayoutGrid } from "lucide-react";

export const PendingBattle = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. LIVE QUEUE HEADER HUD */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Lobby
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Pending Matches
                    </p>
                </div>
                
                {/* Visual indicator of "Active Lobby" state */}
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                        LIVE QUEUE
                    </span>
                </div>
            </div>

            {/* 2. MAIN CARD CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Pending List */}
                <div className="px-6 py-5 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-xl">
                            <Sword size={18} className="text-amber-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Open Challenges
                        </h3>
                    </div>
                    
                    {/* Secondary Layout Icon */}
                    <div className="opacity-30 group hover:opacity-100 transition-opacity">
                        <LayoutGrid size={18} />
                    </div>
                </div>

                {/* 3. TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    {/* This renders your redesigned StickyTable cards */}
                    <StickyTable />
                </div>
            </div>

            {/* 4. MODERATION FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <Clock size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold uppercase leading-relaxed tracking-tight text-gray-400">
                    Matches listed here are currently "Waiting" for an opponent. Admins can monitor for stale games or delete suspicious low-entry challenges.
                </p>
            </div>

            {/* Extra padding for fixed mobile nav/pagination HUD */}
            <div className="h-10" />
        </div>
    );
};