import { StickyTable } from "../utils/allPaymentTable";
import { BadgeIndianRupee, ShieldCheck, Activity } from "lucide-react";

export const AllPayments = () => {
    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER SECTION */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Ledger
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Financial Audit
                    </p>
                </div>
                
                {/* Live Status Indicator */}
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                        SECURE SYNC
                    </span>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[70vh]">
                
                {/* Table Branding Bar */}
                <div className="px-6 py-5 bg-gradient-to-r from-amber-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-xl">
                            <BadgeIndianRupee size={18} className="text-amber-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Transaction History
                        </h3>
                    </div>
                    <ShieldCheck size={16} className="text-gray-700" />
                </div>

                {/* 3. TABLE CONTAINER */}
                <div className="px-1 pb-10">
                    <StickyTable />
                </div>
            </div>

            {/* 4. FOOTER NOTE (Optional) */}
            <div className="mt-6 px-6 flex items-start gap-3 opacity-40">
                <Activity size={14} className="shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight">
                    All transactions shown are end-to-end encrypted and reconciled with the payment gateway provider in real-time.
                </p>
            </div>

            {/* Bottom spacer for fixed pagination HUD */}
            <div className="h-10" />
        </div>
    );
};