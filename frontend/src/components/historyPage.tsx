import { useEffect, useState } from "react";
import { HistoryCard } from "./historyCard";
import axios from "axios";
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { ArrowLeft, Clock, Filter, Inbox, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HistoryPage = () => {
  const { userId } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadNotificatons = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/auth/notifications`, {
          params: { userId },
        });

        if (response.data) {
          // Filter out the initial empty object state if your API returns a clean array
          setNotifications(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.log("err :" + err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotificatons();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0b0b0d]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-2 border-blue-500 animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f12] min-h-screen w-full max-w-md mx-auto flex flex-col shadow-2xl">
      
      {/* Premium Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f12]/80 backdrop-blur-xl border-b border-white/5 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight italic">TRANSACTIONS</h1>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Activity Log</p>
            </div>
          </div>
          <button className="p-2 bg-[#1a1a1f] border border-white/5 rounded-xl text-gray-400">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 space-y-4 pb-24">
        {notifications.length > 0 ? (
          <>
            {/* Grouping Header (Optional: Can be dynamic based on date) */}
            <div className="flex items-center gap-2 px-1 mb-2">
              <Clock size={14} className="text-gray-600" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Recent Activity</span>
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification._id} className="animate-slide-up">
                  <HistoryCard notification={notification} />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center pt-20 text-center px-10">
            <div className="bg-[#1a1a1f] p-8 rounded-full mb-6 border border-white/5 shadow-inner">
              <Inbox size={48} className="text-gray-700" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No History Found</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Looks like you haven't made any moves yet. Start a battle to see your history here!
            </p>
            <button 
              onClick={() => navigate('/home')}
              className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Start Playing
            </button>
          </div>
        )}
      </div>

      {/* Subtle Bottom Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none" />
    </div>
  );
};