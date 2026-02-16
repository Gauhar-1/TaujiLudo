import { ArrowUpRight, ArrowDownLeft, CheckCircle2, XCircle, Timer, Hash } from "lucide-react";

export const HistoryCard = (props: any) => {
  const { type, status, amount, paymentReference, createdAt } = props.notification;
  
  // Format Date and Time separately
  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const formattedTime = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // UI Configuration based on transaction type
  const isDeposit = type === "deposit" || type === "win";
  const statusColors = {
    success: "text-emerald-500",
    failed: "text-red-500",
    pending: "text-amber-500"
  };

  const StatusIcon = () => {
    if (status === "success") return <CheckCircle2 size={12} className="text-emerald-500" />;
    if (status === "failed") return <XCircle size={12} className="text-red-500" />;
    return <Timer size={12} className="text-amber-500" />;
  };

  return (
    <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-all shadow-lg active:scale-[0.98]">
      
      {/* Date & Time Column */}
      <div className="flex flex-col items-center justify-center bg-[#25252b] rounded-xl px-3 py-2 min-w-[60px] border border-white/5">
        <span className="text-[11px] font-black text-white uppercase tracking-tighter">
          {formattedDate}
        </span>
        <span className="text-[9px] font-bold text-gray-500 uppercase">
          {formattedTime}
        </span>
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1 rounded-md ${isDeposit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            {isDeposit ? <ArrowDownLeft size={14} strokeWidth={3} /> : <ArrowUpRight size={14} strokeWidth={3} />}
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">
            {type}
          </h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Hash size={10} className="text-gray-600" />
          <p className="text-[10px] font-mono text-gray-500 truncate">
            {paymentReference || "N/A"}
          </p>
        </div>
      </div>

      {/* Amount & Status Column */}
      <div className="text-right flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <span className={`text-sm font-black italic ${isDeposit ? 'text-emerald-500' : 'text-white'}`}>
            {isDeposit ? "+" : "-"} ₹{amount}
          </span>
        </div>
        
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/5`}>
          <StatusIcon />
          <span className={`text-[9px] font-black uppercase tracking-widest ${statusColors[status as keyof typeof statusColors] || 'text-gray-400'}`}>
            {status}
          </span>
        </div>
      </div>
      
    </div>
  );
};