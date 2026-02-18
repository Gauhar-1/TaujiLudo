import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { 
  LayoutDashboard, Users, Sword, ShieldCheck, 
  CreditCard, Bell, Settings, LogOut, ChevronDown, 
  UserX, Clock, Trophy, AlertTriangle, BadgeIndianRupee,
  Zap, ArrowRight
} from "lucide-react";

export const AdminSideBar = (props: any) => {
  const navigate = useNavigate();
  const { setAdminClicked } = useUserContext();

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    players: false,
    battle: false,
    kyc: false,
    payments: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navTo = (path: string) => {
    navigate(path);
    props.setSidebarClicked(false);
  };

  return (
    /* The container sits inside the header's centered flex column */
    <div className="w-full flex flex-col items-center animate-slide-down">
      
      {/* Main Sidebar Module */}
      <div className="w-full bg-[#1c1c21]/95 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] flex flex-col overflow-hidden max-h-[75vh]">
        
        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-1">
          
          <AdminNavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard Overview" 
            onClick={() => navTo('/admin')} 
          />

          <div className="h-px bg-white/5 mx-4 my-2" />

          {/* USER SECTION */}
          <CollapsibleMenu 
            icon={<Users size={18} />} 
            label="User Management" 
            isOpen={openMenus.players} 
            onClick={() => toggleMenu('players')}
          >
            <SubNavItem label="All Players" onClick={() => navTo('allPlayers')} />
            <SubNavItem icon={<UserX size={14} />} label="Blocked" onClick={() => navTo('blocked')} />
          </CollapsibleMenu>

          {/* BATTLE SECTION */}
          <CollapsibleMenu 
            icon={<Sword size={18} />} 
            label="Battle Ops" 
            isOpen={openMenus.battle} 
            onClick={() => toggleMenu('battle')}
          >
            <SubNavItem icon={<Clock size={14} />} label="New Battle" onClick={() => navTo('pendingBattle')} />
            <SubNavItem icon={<Zap size={14} />} label="Running" onClick={() => navTo('runningBattle')} />
            <SubNavItem icon={<Trophy size={14} />} label="Results" onClick={() => navTo('completeBattle')} />
            <SubNavItem icon={<AlertTriangle size={14} />} label="Disputes" onClick={() => navTo('disputeBattle')} />
          </CollapsibleMenu>

          {/* KYC SECTION */}
          <CollapsibleMenu 
            icon={<ShieldCheck size={18} />} 
            label="Verification" 
            isOpen={openMenus.kyc} 
            onClick={() => toggleMenu('kyc')}
          >
            <SubNavItem label="Pending KYC" onClick={() => navTo('pendingKyc')} />
            <SubNavItem label="Approved" onClick={() => navTo('verifiedKyc')} />
          </CollapsibleMenu>

          {/* PAYMENTS SECTION */}
          <CollapsibleMenu 
            icon={<BadgeIndianRupee size={18} />} 
            label="Finance Hub" 
            isOpen={openMenus.payments} 
            onClick={() => toggleMenu('payments')}
          >
            <SubNavItem label="Receipts" onClick={() => navTo('allPayments')} />
            <SubNavItem label="Manual Recharge" onClick={() => navTo('rechargeUser')} />
            <SubNavItem label="Gateways" onClick={() => navTo('paymentSettings')} />
          </CollapsibleMenu>

          <div className="h-px bg-white/5 mx-4 my-2" />

          <AdminNavItem 
            icon={<CreditCard size={18} />} 
            label="Payout Requests" 
            onClick={() => navTo('reqPayments')} 
          />
          
          <AdminNavItem 
            icon={<Settings size={18} />} 
            label="Global Settings" 
            onClick={() => navTo('adminSettings')} 
          />

          <AdminNavItem 
            icon={<Bell size={18} />} 
            label="Push Center" 
            onClick={() => navTo('adminNotification')} 
          />
        </div>

        {/* Footer: Context Switch */}
        <div className="p-3 bg-white/5 border-t border-white/5">
          <button 
            onClick={() => { setAdminClicked(false); navigate('/profile'); }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Terminate Admin Mode</span>
            </div>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Modernized Sub-components ---

const AdminNavItem = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group active:scale-95"
  >
    <div className="text-gray-500 group-hover:text-amber-500 transition-colors">{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const CollapsibleMenu = ({ icon, label, isOpen, onClick, children }: any) => (
  <div className="flex flex-col">
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isOpen ? 'bg-amber-500/10 text-amber-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-4">
        <div className={isOpen ? 'text-amber-500' : 'text-gray-500'}>{icon}</div>
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="px-2 pb-2 space-y-1 animate-fade-in">{children}</div>}
  </div>
);

const SubNavItem = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest pl-10"
  >
    {icon || <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />}
    {label}
  </button>
);