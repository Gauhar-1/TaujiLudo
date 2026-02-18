import { useState } from "react";
import { AdminSideBar } from "./adminSideBar";
import { Menu, ShieldCheck, Bell, X } from "lucide-react";

export const AdminHeader = () => {
  const [sidebarClicked, setSidebarClicked] = useState(false);

  return (
    // 1. We keep the fixed container, but allow pointer events to pass through
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center w-full px-2 pt-2 pointer-events-none">
      
      {/* 2. MAIN HEADER BAR */}
      <div className="w-full max-w-md bg-[#1c1c21]/95 backdrop-blur-xl border border-amber-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto z-50">
        <div className="flex items-center justify-between px-4 py-3">
          
          {/* Left: Menu & Branding */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarClicked(!sidebarClicked)}
              className="p-2 bg-white/5 hover:bg-amber-500/10 rounded-xl transition-all text-amber-500 active:scale-90"
            >
              {sidebarClicked ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-500 leading-none">
                Control
              </h1>
              <span className="text-[12px] font-black text-white italic tracking-tight uppercase">
                Panel
              </span>
            </div>
          </div>

          {/* Right: Status & Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden xs:flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <ShieldCheck size={12} className="text-amber-500" />
              <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">
                Authorized
              </span>
            </div>

            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full border border-[#1c1c21]" />
            </button>

            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5">
              <div className="h-full w-full bg-[#1c1c21] rounded-[10px] overflow-hidden">
                <img src="/profile.png" alt="Admin" className="h-full w-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIDEBAR (Dropdown Style) */}
      {/* We use a transition wrapper to make it slide out from under the header */}
      <div 
        className={`w-full max-w-[95%] mx-auto transition-all duration-300 ease-in-out pointer-events-auto overflow-hidden
          ${sidebarClicked ? "max-h-[80vh] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
      >
        <div className="bg-[#1c1c21]/98 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-3xl p-2">
            {/* Pass setSidebarClicked to close it when a link is clicked */}
            <AdminSideBar setSidebarClicked={setSidebarClicked} />
        </div>
      </div>

      {/* 4. BACKGROUND DIMMER (Optional) */}
      {sidebarClicked && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 pointer-events-auto"
          onClick={() => setSidebarClicked(false)}
        />
      )}
    </header>
  );
};