import { StickyTable } from "../utils/payReqTable";
import { Banknote, ShieldCheck, Activity,Clock } from "lucide-react";

export const ReqPayments = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. FINANCIAL HUB HEADER */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Settlement
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Authorization Desk
                    </p>
                </div>
                
                {/* Visual indicator of "Action Required" state */}
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Clock size={12} className="text-amber-500 animate-pulse" />
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                        PENDING
                    </span>
                </div>
            </div>

            {/* 2. MAIN REQUEST CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[75vh]">
                
                {/* Branding Header for the Request List */}
                <div className="px-6 py-5 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-xl">
                            <Banknote size={18} className="text-amber-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Approval Queue
                        </h3>
                    </div>
                    
                    {/* Security Verification Icon */}
                    <div className="opacity-30 group hover:opacity-100 transition-opacity">
                        <ShieldCheck size={18} className="text-amber-500" />
                    </div>
                </div>

                {/* 3. TABLE/CARD FEED CONTAINER */}
                <div className="px-1 pb-10">
                    {/* This renders the redesigned StickyTable cards we built earlier */}
                    <StickyTable />
                </div>
            </div>

            {/* 4. AUDIT FOOTNOTE */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-30 italic">
                <Activity size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold uppercase leading-relaxed tracking-tight text-gray-400">
                    Attention: Review all UTR and Bank details before approval. Once a settlement is authorized, funds are moved immediately.
                </p>
            </div>

            {/* Extra padding for fixed mobile nav/pagination HUD */}
            <div className="h-10" />
        </div>
    );
};