import { StickyTable } from "../utils/BlockedTable";
import { ShieldX, ShieldAlert, Lock,} from "lucide-react";

export const BlockedPlayer = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. SECURITY HEADER HUD */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Blacklist
                    </h1>
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1">
                        Restricted Access
                    </p>
                </div>
                
                {/* Visual indicator of "Banned" state */}
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                        SECURE ZONE
                    </span>
                </div>
            </div>

            {/* 2. MAIN CARD CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-red-500/10 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Blacklist */}
                <div className="px-6 py-5 bg-gradient-to-br from-red-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <ShieldX size={18} className="text-red-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Suspended Profiles
                        </h3>
                    </div>
                    
                    {/* Secondary Lock Icon */}
                    <div className="text-gray-700">
                        <Lock size={16} />
                    </div>
                </div>

                {/* 3. BLOCKED TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    <StickyTable />
                </div>
            </div>

            {/* 4. SECURITY FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <ShieldAlert size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold uppercase leading-relaxed tracking-tight">
                    Warning: Reinstating users from this list allows them full access to financial transactions and battle lobbies. Verify identity before unblocking.
                </p>
            </div>

            {/* Extra padding for fixed mobile HUD controls */}
            <div className="h-10" />
        </div>
    );
}