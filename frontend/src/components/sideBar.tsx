import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/url";
import { 
  User, Wallet, History, Users, Bell, 
  Headset, ShieldAlert, Home, Trophy, ChevronRight 
} from "lucide-react";

export const SideBar = (props: any) => {
  const navigate = useNavigate();
  const { setAdminClicked, phone, name } = useUserContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/check-admin`, { params: { phoneNumber: phone } });
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    if (phone) checkAdmin();
  }, [phone]);

  const navTo = (path: string) => {
    navigate(path);
    props.setSidebarClicked(false);
  };

  return (
    /* Change 1: Added pointer-events-none to the root fixed wrapper 
       so clicks can pass through to the game if the menu isn't there */
    <div className="fixed top-16 left-0 right-0 bottom-0 z-[100] flex justify-center pointer-events-none">
      
      {/* Change 2: The Overlay needs pointer-events-auto to be clickable (to close)
          and a lower z-index than the panel */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in pointer-events-auto z-0"
        onClick={() => props.setSidebarClicked(false)}
      />

      {/* Change 3: The Panel needs relative positioning and a higher z-index (z-10) 
          plus pointer-events-auto to make buttons clickable */}
      <div className="relative z-10 w-full max-w-sm bg-[#0f0f12] h-fit max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b border-white/10 rounded-b-[2rem] flex flex-col transform transition-transform duration-300 ease-out animate-slide-down pointer-events-auto">
        
        {/* Compact User Identity */}
        <div className="p-4 bg-gradient-to-r from-purple-900/10 to-transparent border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <User className="text-white" size={20} />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-[#0f0f12]"></div>
                </div>
                <div className="min-w-0">
                    <h2 className="text-xs font-black text-white uppercase truncate tracking-tight">{name || "Gamer"}</h2>
                    <p className="text-[8px] text-purple-400 font-bold tracking-widest uppercase">+91 {phone}</p>
                </div>
            </div>
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-purple-600/50 italic">TaujiLudo</div>
        </div>

        {/* Scrollable Grid Navigation */}
        <div className="overflow-y-auto py-4 px-4 custom-scrollbar bg-[#0f0f12] rounded-b-[2rem]">
          
          <div className="grid grid-cols-2 gap-2">
            <NavItem icon={<Home size={16}/>} label="Arena" onClick={() => navTo('/winCash')} />
            <NavItem icon={<User size={16}/>} label="Profile" onClick={() => navTo('/profile')} />
            <NavItem icon={<Wallet size={16}/>} label="Wallet" onClick={() => navTo('/wallet')} />
            <NavItem icon={<Trophy size={16}/>} label="Battles" onClick={() => navTo('/gameHistory')} />
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
             <NavItem icon={<History size={16}/>} label="History" onClick={() => navTo('/history')} />
             <NavItem icon={<Users size={16}/>} label="Refer" onClick={() => navTo('/refer')} />
             <NavItem icon={<Bell size={16}/>} label="Alerts" onClick={() => navTo('/notification')} />
             <NavItem icon={<Headset size={16}/>} label="Support" onClick={() => navTo('/support')} />
          </div>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-amber-500/20">
              <button 
                onClick={() => { navTo('/admin'); setAdminClicked(true); }}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.05)]"
              >
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin Control Panel</span>
              </button>
            </div>
          )}

          <button 
            onClick={() => props.setSidebarClicked(false)}
            className="mt-6 w-full py-2 flex justify-center text-gray-600 hover:text-white transition-colors"
          >
            <ChevronRight size={20} className="rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

// NavItem subcomponent remains the same
const NavItem = ({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 p-3 rounded-xl bg-[#16161a] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all group active:scale-95"
  >
    <div className="text-gray-500 group-hover:text-purple-500 transition-colors">
      {icon}
    </div>
    <span className="text-[10px] font-bold tracking-tight uppercase truncate">{label}</span>
  </button>
);