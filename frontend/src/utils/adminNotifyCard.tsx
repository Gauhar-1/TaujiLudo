import { formatDistanceToNowStrict } from "date-fns";
import { API_URL } from "./url";
import axios from "axios";
import { 
  Bell, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  IndianRupee,
  CheckCircle2
} from "lucide-react";

export const NotifyCard = (props: any) => {
  const { notification } = props;

  const handleRead = async () => {
    const id = notification._id;
    if (!id) return console.log("notification id not found!");

    try {
      const response = await axios.post(`${API_URL}/api/auth/markRead`, { id });
      if (!response.data) return console.log("response not found");
      // Ideally, trigger a state refresh in parent here
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const isDeposit = notification.type === "deposit";
  const isRead = notification.markAsRead;

  return (
    <div className="px-4 mb-3 group">
      <div 
        className={`relative transition-all duration-300 rounded-2xl border p-4 shadow-xl 
        ${isRead 
          ? "bg-[#16161a]/60 border-white/5 opacity-60" 
          : "bg-[#16161a] border-amber-500/20 ring-1 ring-amber-500/5"}`}
      >
        
        {/* Unread Indicator Dot */}
        {!isRead && (
          <div className="absolute top-4 right-4 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            
            {/* Semantic Icon Avatar */}
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shrink-0
              ${isDeposit 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"}`}
            >
              {isDeposit ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-tight">
                  Player Activity
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                  ${isDeposit ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"}`}
                >
                  {notification.type}
                </span>
              </div>

              <p className="text-sm text-gray-400 mt-1">
                <span className="font-bold text-gray-200">A Player</span> has 
                {isDeposit ? " initiated a deposit" : " requested a withdrawal"}.
              </p>

              <div className="flex items-center gap-1.5 mt-2 bg-white/5 w-fit px-2 py-1 rounded-lg border border-white/5">
                <IndianRupee size={12} className={isDeposit ? "text-emerald-500" : "text-rose-500"} />
                <span className="text-xs font-black italic text-white">
                  {isDeposit ? "+" : "-"}{notification.amount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between h-20 shrink-0">
            {/* Mark as Read Toggle */}
            <button 
              onClick={handleRead}
              className={`p-2 rounded-xl transition-all active:scale-90 
                ${isRead 
                  ? "text-gray-600 cursor-default" 
                  : "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black"}`}
              title={isRead ? "Already read" : "Mark as read"}
            >
              {isRead ? <CheckCircle2 size={18} /> : <Bell size={18} />}
            </button>

            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
              {formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};