import { Search, ShieldCheck, User, Phone, Fingerprint, FileText, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {  KycView } from "./action";
import { API_URL } from "./url";



interface Data {
  no: number;
  userId: string;
  name: string;
  phone: string;
  number: string;
  action: ReactElement;
}

function createData(
    no: number,
    userId: string,
    name: string,
    phone: string,
    number: string,
    action: ReactElement,
): Data {
  return {
    no,
    userId,
    name,
    phone,
    number,
    action,
  };
}

export const StickyTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rows, setRows] = useState<Data[]>([]);

  // Fetch battles data
  useEffect(() => {
    const runningBattle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/getProfiles`);
        const fetchedBattles = response.data.map((profile: any, index: number) => {
           const {kycDetails} = profile;
          return createData(
            index + 1,
            profile.userId,
            profile.name,
            profile.phoneNumber,
            kycDetails.documentNumber,
            <div className="flex gap-2">
                <KycView phoneNumber={profile.phoneNumber}></KycView>
              </div>
          );
        });
        setRows(fetchedBattles);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    runningBattle();

    // Polling every 5 seconds
    const interval = setInterval(runningBattle, 5000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);


  const filterEachRow = (row: Data) => {
    const query = searchQuery.toLowerCase();
    return (
      row.userId.toLowerCase().includes(query) ||
      row.name.toLowerCase().includes(query) ||
      row.number.toLowerCase().includes(query)
    );
  };

  const filteredRows = rows.filter(filterEachRow);

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-screen pb-24">
      
      {/* HEADER SECTION */}
      <div className="sticky top-0 z-30 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ShieldCheck className="text-amber-500" size={20} />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Trust Desk</h2>
            </div>
            <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    {filteredRows.length} Profiles
                </span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search name or ID..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 transition-all shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* KYC CARD LIST */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.userId} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative group transition-all active:scale-[0.98]">
            
            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 shadow-lg shadow-amber-900/10">
                   <User size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{row.name}</h3>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FileText size={10} />
                    <span className="text-[9px] font-mono tracking-tighter uppercase italic">UID: {row.userId.slice(-10)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/5 px-2 py-1 rounded text-[8px] font-black text-gray-500 uppercase tracking-widest">
                  Identity Case
                </div>
              </div>
            </div>

            {/* Document Data Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-white/[0.02] border-y border-white/5">
                <div className="space-y-2 border-r border-white/5 pr-4">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={12} className="text-amber-500/50" />
                        <span className="text-[10px] font-bold tracking-tight text-gray-300">{row.phone}</span>
                    </div>
                    <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Registered Phone</p>
                </div>
                <div className="space-y-2 pl-4">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Fingerprint size={12} className="text-amber-500/50" />
                        <span className="text-[10px] font-mono tracking-tighter text-gray-300">
                            {row.number === "NOT_UPLOADED" ? "PENDING" : row.number}
                        </span>
                    </div>
                    <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Document No.</p>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 bg-gradient-to-t from-amber-600/[0.03] to-transparent flex items-center justify-between">
                <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em] italic">Verification required</p>
                <div className="w-32 transform transition-transform group-hover:scale-105 active:scale-95">
                   {row.action}
                </div>
            </div>

            {/* Watermark */}
            <ShieldCheck className="absolute -right-4 -top-4 text-amber-500/[0.03] -rotate-12" size={100} />
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <Inbox size={60} className="mx-auto text-gray-500" />
            <p className="font-black uppercase tracking-[0.3em] mt-4 text-white">No Profiles Found</p>
          </div>
        )}
      </div>

      {/* FIXED PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-[#16161a] rounded-xl px-2 py-1 border border-white/5">
            <select 
                className="bg-transparent text-[10px] font-black text-amber-500 p-2 outline-none"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
            >
                <option value={10}>10 Items</option>
                <option value={25}>25 Items</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-3 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center min-w-[40px]">
                <span className="text-xs font-black text-white italic leading-none">{page + 1}</span>
                <span className="text-[7px] font-bold text-gray-600 uppercase mt-1 tracking-tighter">Page</span>
            </div>
            <button 
              disabled={page * rowsPerPage + rowsPerPage >= filteredRows.length}
              onClick={() => setPage(page + 1)}
              className="p-3 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-95 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
      </div>

    </div>
  );
};