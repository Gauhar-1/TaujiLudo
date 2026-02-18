import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/url";
import { NotifyCard } from "../utils/adminNotifyCard";
import { Bell, CheckCheck, Inbox, RefreshCw, Trash2 } from "lucide-react";

type NotificationType = {
  _id: string;
  userId: string;
  type: string;
  amount: number;
  message: string;
  status: string;
  paymentReference: string;
  createdAt: Date;
  markAsRead: boolean;
};

export const AdminNotification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/auth/allNotifications`);
      setNotifications(response.data);
    } catch (err) {
      console.log("err :" + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.markAsRead).length;

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto flex flex-col font-sans text-gray-100">
      
      {/* 1. STICKY GLASS HEADER */}
      <div className="sticky top-0 z-40 bg-[#0b0b0d]/80 backdrop-blur-xl border-b border-white/5 p-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
              Activity
            </h1>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
              System Logs
            </p>
          </div>
          
          <button 
            onClick={loadNotifications}
            className={`p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Quick Stats & Action Row */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <Bell size={12} className="text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              {unreadCount} Unread
            </span>
          </div>

          <button className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors group">
            <CheckCheck size={14} className="group-hover:text-emerald-500" />
            Mark all read
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATION FEED */}
      <div className="flex-1 px-2 pt-4 pb-24">
        {notifications.length > 0 ? (
          <div className="space-y-1">
            {/* Logic: You could split these into "Today" and "Earlier" map blocks */}
            {notifications.map((notification) => (
              <NotifyCard key={notification._id} notification={notification} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <div className="relative">
                <Inbox size={80} strokeWidth={1} />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full border-4 border-[#0b0b0d]" />
            </div>
            <p className="mt-4 font-black uppercase tracking-[0.3em] text-sm text-center">
              Logs Clear
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
              No new activity detected
            </p>
          </div>
        )}
      </div>

      {/* 3. BOTTOM FLOATING ACTION (Optional) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button 
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-2xl backdrop-blur-md group"
          onClick={() => {/* Function to clear all notifications */}}
        >
          <Trash2 size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Wipe Feed</span>
        </button>
      </div>

    </div>
  );
};