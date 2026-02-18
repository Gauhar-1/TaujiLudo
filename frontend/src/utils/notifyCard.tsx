import { formatDistanceToNowStrict } from "date-fns";
import { useUserContext } from "../hooks/UserContext";
import {  
  ShieldCheck, 
  Sword, 
  Clock, 
  ChevronRight, 
  BadgeIndianRupee
} from "lucide-react";

export const NotifyCard = ({ notification }: { notification: any }) => {
  if (!notification.Date) return null;
  
  const { userId } = useUserContext();

  // Configuration for different notification types
  const config = {
    notification: {
      label: "Transaction",
      icon: <BadgeIndianRupee size={18} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      message: notification.reason || "Wallet update received"
    },
    profile: {
      label: "Verification",
      icon: <ShieldCheck size={18} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      message: notification.kycDetails?.reason || "KYC status updated"
    },
    Battle: {
      label: "Battle Dispute",
      icon: <Sword size={18} />,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      message: notification.dispute?.proofs?.[1]?.player === userId 
        ? (notification.dispute?.proofs?.[1]?.adminReason || "Match review complete")
        : (notification.dispute?.proofs?.[0]?.adminReason || "Match review complete")
    }
  };

  // Safe fallback to handle unknown types
  const type = (notification.type as keyof typeof config) || "notification";
  const current = config[type];

  // Logic to handle different date sources safely
  const getRawDate = () => {
    if (type === "profile") return notification.kycDetails?.createdAt;
    if (type === "Battle") return notification.dispute?.timestamp;
    return notification.createdAt;
  };

  const timeAgo = getRawDate() 
    ? formatDistanceToNowStrict(new Date(getRawDate()), { addSuffix: true })
    : "Recently";

  return (
    <div className="mx-4 mb-3 group">
      <div className={`bg-[#16161a] border ${current.border} rounded-2xl overflow-hidden shadow-lg transition-all active:scale-[0.98] relative`}>
        
        {/* Interaction Glow */}
        <div className={`absolute top-0 left-0 w-1 h-full ${current.color.replace('text', 'bg')}`} />

        <div className="p-4 flex items-start gap-4">
          {/* Icon Section */}
          <div className={`${current.bg} ${current.color} p-3 rounded-xl shadow-inner shrink-0`}>
            {current.icon}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${current.color}`}>
                {current.label}
              </span>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={10} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  {timeAgo}
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-gray-300 leading-relaxed break-words pr-2">
              {current.message}
            </p>
          </div>

          {/* Decorative Arrow */}
          <div className="self-center text-gray-800">
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Action Hint (Optional - shown on active states) */}
        <div className="bg-white/[0.02] px-4 py-1.5 flex justify-end border-t border-white/5">
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">
              Tap to view details
            </span>
        </div>
      </div>
    </div>
  );
};