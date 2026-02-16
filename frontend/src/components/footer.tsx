import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { Home, Wallet, User, ShieldQuestion } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To detect active tab
  const { login } = useUserContext();

  // Helper to check if a path is active
  const isActive = (path: string) => location.pathname === path;

  if (!login) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
      <div className="w-full max-w-sm bg-[#1a1a1f]/95 backdrop-blur-xl border border-white/10 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] rounded-2xl flex justify-between items-center px-6 py-3 pointer-events-auto">
        
        {/* Home Tab */}
        <button
          onClick={() => navigate("/winCash")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isActive("/winCash") || isActive("/home") ? "text-red-500 scale-110" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Home size={20} strokeWidth={isActive("/winCash") ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Lobby</span>
          {isActive("/winCash") && (
            <div className="absolute -bottom-1 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
          )}
        </button>

        {/* Wallet Tab */}
        <button
          onClick={() => navigate("/wallet")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isActive("/wallet") ? "text-green-500 scale-110" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Wallet size={20} strokeWidth={isActive("/wallet") ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Wallet</span>
          {isActive("/wallet") && (
            <div className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
          )}
        </button>

        {/* Support/Rules Tab (New - highly recommended for UX) */}
        <button
          onClick={() => navigate("/support")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isActive("/support") ? "text-blue-500 scale-110" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <ShieldQuestion size={20} strokeWidth={isActive("/support") ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Support</span>
          {isActive("/support") && (
            <div className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
          )}
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isActive("/profile") ? "text-purple-500 scale-110" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <div className={`p-0.5 rounded-full border-2 ${isActive("/profile") ? "border-purple-500" : "border-transparent"}`}>
             <User size={20} strokeWidth={isActive("/profile") ? 3 : 2} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
          {isActive("/profile") && (
            <div className="absolute -bottom-1 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
          )}
        </button>

      </div>
    </div>
  );
};