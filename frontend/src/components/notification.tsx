import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { NotifyCard } from "../utils/notifyCard";
import { Bell, ArrowLeft, Inbox, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Notifications = () => {
  const { userId } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [combinedData, setCombinedData] = useState<any[]>([]);

  useEffect(() => {
    const loadNotificatons = async () => {
      setIsLoading(true);
      try {
        // 🔵 Fetch Notifications
        const response = await axios.get(`${API_URL}/api/auth/notifications`, {
          params: { userId },
        });
        let notifications = response.data?.map((n: any) => ({
          ...n,
          type: "notification",
        })) || [];

        // 🔵 Fetch Profiles (KYC alerts)
        const profileResponse = await axios.get(`${API_URL}/api/auth/getProfiles`);
        let profiles = profileResponse.data?.map((p: any) => ({
          ...p,
          type: "profile",
        })) || [];

        // 🔵 Fetch Battles (Disputes)
        const battleResponse = await axios.get(`${API_URL}/api/auth/battles/battleHistory`, { 
          params: { userId },
        });
        let battles = battleResponse.data?.map((b: any) => ({
          ...b,
          type: "Battle",
        })) || [];

        // 🔵 Merge & Sort
        const mergedData = [...notifications, ...profiles, ...battles].sort((a, b) => {
          const dateA = new Date(a.kycDetails?.createdAt || a.createdAt || (a.dispute ? a.dispute?.timestamp : 0)).getTime();
          const dateB = new Date(b.kycDetails?.createdAt || b.createdAt || (b.dispute ? b.dispute?.timestamp : 0)).getTime();
          return dateB - dateA;
        });

        setCombinedData(mergedData);
      } catch (err) {
        console.error("🛑 Error loading notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) loadNotificatons();
  }, [userId]);

  // Filter logic based on your criteria
  const filteredData = combinedData.filter((item) => {
    if (item.type === "notification") return !!item.reason;
    if (item.type === "profile") return !!item.kycDetails?.reason;
    if (item.type === "Battle") return !!item.dispute;
    return false;
  });

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto text-gray-100 font-sans pb-24">
      
      {/* Premium Header */}
      <div className="sticky top-0 z-40 bg-[#0b0b0d]/80 backdrop-blur-md border-b border-white/5 px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tight uppercase leading-none">Alerts</h1>
            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mt-1">Updates & Reports</p>
          </div>
        </div>
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          {filteredData.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-6">
        {isLoading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="h-12 w-12 border-4 border-t-purple-500 border-purple-500/20 rounded-full animate-spin"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="flex flex-col gap-3">
            {/* Legend/Info Badge */}
            <div className="flex items-center gap-2 px-2 mb-2">
              <Sparkles size={14} className="text-yellow-500" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Latest Activity</span>
            </div>

            {filteredData.map((notification) => (
              <div key={notification._id} className="animate-slide-up">
                <NotifyCard notification={notification} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center pt-20 text-center px-10">
            <div className="bg-[#16161a] p-8 rounded-[2.5rem] mb-6 border border-white/5 shadow-inner">
              <Inbox size={48} className="text-gray-800" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">All Caught Up!</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              No new notifications. We'll let you know when something important happens in the arena.
            </p>
            <button 
              onClick={() => navigate('/winCash')}
              className="mt-8 bg-[#1a1a1f] border border-white/5 text-gray-400 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
            >
              Back To Lobby
            </button>
          </div>
        )}
      </div>

      {/* Decorative Glow */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-purple-600/5 to-transparent pointer-events-none" />
    </div>
  );
}