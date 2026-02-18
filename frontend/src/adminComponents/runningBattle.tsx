import { StickyTable } from "../utils/runningBTable";
import { Zap, Activity, Sword,} from "lucide-react";

export const RunningBattle = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. LIVE MONITOR HEADER HUD */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Live Hub
                    </h1>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">
                        Active Engagements
                    </p>
                </div>
                
                {/* Visual indicator of "Live" state */}
                <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                        MONITORING
                    </span>
                </div>
            </div>

            {/* 2. MAIN BATTLE CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Live List */}
                <div className="px-6 py-5 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <Zap size={18} className="text-blue-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Active Matches
                        </h3>
                    </div>
                    
                    {/* Secondary Battle Icon */}
                    <div className="opacity-30 group hover:opacity-100 transition-opacity">
                        <Sword size={18} className="text-blue-500" />
                    </div>
                </div>

                {/* 3. TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    {/* This renders your redesigned StickyTable with the dual-player cards */}
                    <StickyTable />
                </div>
            </div>

            {/* 4. OPERATIONAL FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <Activity size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold uppercase leading-relaxed tracking-tight text-gray-400">
                    Currently tracking live room codes and player connections. Use the "Live Hub" to ensure match integrity and detect idle rooms.
                </p>
            </div>

            {/* Extra padding for fixed mobile nav/pagination HUD */}
            <div className="h-10" />
        </div>
    );
}