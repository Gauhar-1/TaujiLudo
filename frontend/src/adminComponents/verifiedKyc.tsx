import { StickyTable } from "../utils/verifiedKycTable";
import { ShieldCheck, UserCheck, ClipboardCheck, Activity, } from "lucide-react";

export const VerifiedKyc = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. REGISTRY HEADER HUD */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Registry
                    </h1>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">
                        Identity Archive
                    </p>
                </div>
                
                {/* Visual indicator of "Verified" state */}
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        AUTHORIZED
                    </span>
                </div>
            </div>

            {/* 2. MAIN REGISTRY CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Verified List */}
                <div className="px-6 py-5 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                            <UserCheck size={18} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Verified Users
                        </h3>
                    </div>
                    
                    {/* Secondary Clipboard Icon */}
                    <div className="opacity-30 group hover:opacity-100 transition-opacity">
                        <ClipboardCheck size={18} className="text-emerald-500" />
                    </div>
                </div>

                {/* 3. TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    {/* This renders the redesigned StickyTable cards for Verified users */}
                    <StickyTable />
                </div>
            </div>

            {/* 4. AUDIT FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <Activity size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold uppercase leading-relaxed tracking-tight text-gray-400">
                    This registry contains players who have completed the full KYC protocol. These accounts have unrestricted access to withdrawals and high-stakes battles.
                </p>
            </div>

            {/* Extra padding for fixed mobile nav/pagination HUD */}
            <div className="h-10" />
        </div>
    );
};