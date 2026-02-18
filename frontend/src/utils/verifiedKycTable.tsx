import { Search, ShieldCheck, User, Phone, Fingerprint, FileText, ChevronLeft, ChevronRight, Inbox, MoreVertical } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { KycView } from "./action";
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
  action: ReactElement
): Data {
  return { no, userId, name, phone, number, action };
}

export const StickyTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rows, setRows] = useState<Data[]>([]);

  useEffect(() => {
    const fetchKycProfiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/kycProfiles`);
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const { kycDetails } = profile;
          return createData(
            index + 1,
            profile.userId,
            profile.name || "Unnamed User",
            profile.phoneNumber || "N/A",
            kycDetails?.documentNumber || "NOT_UPLOADED",
            <div className="w-full active:scale-95 transition-all">
               <KycView phoneNumber={profile.phoneNumber} />
            </div>
          );
        });
        setRows(fetchedBattles);
      } catch (err) {
        console.error("Error fetching KYC profiles:", err);
      }
    };

    fetchKycProfiles();
    const interval = setInterval(fetchKycProfiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-screen pb-28">
      
      {/* 1. SEARCH & HEADER HUD */}
      <div className="sticky top-0 z-30 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/20 p-2 rounded-lg">
                <ShieldCheck className="text-amber-500" size={20} />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Trust Desk</h2>
          </div>
          <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              {filteredRows.length} Cases
            </span>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name, ID or mobile..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 transition-all shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2. VERIFICATION CARD LIST */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.userId} className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            
            {/* User Profile Summary */}
            <div className="p-6 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 shadow-lg shadow-amber-900/10">
                   <User size={28} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">{row.name}</h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={10} className="text-amber-500/50" />
                        <span className="text-[10px] font-bold tracking-widest">{row.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FileText size={10} />
                        <span className="text-[9px] font-mono tracking-tighter uppercase italic">UID: {row.userId.slice(-10)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="text-gray-700 hover:text-gray-400 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Document Verification Grid */}
            <div className="px-6 py-4 bg-white/[0.02] border-y border-white/5">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Fingerprint size={14} className="text-amber-500" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Official Document ID</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-lg font-mono font-black tracking-widest text-white">
                            {row.number === "NOT_UPLOADED" ? "PENDING..." : row.number}
                        </p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${row.number === "NOT_UPLOADED" ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            {row.number === "NOT_UPLOADED" ? 'Unverified' : 'Uploaded'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 bg-gradient-to-t from-amber-600/[0.03] to-transparent flex items-center justify-between gap-4">
                <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic ml-2 shrink-0">Case Review Req.</p>
                <div className="flex-1">
                   {row.action}
                </div>
            </div>

            {/* Background Icon Watermark */}
            <ShieldCheck className="absolute -right-4 -bottom-4 text-amber-500/[0.03] -rotate-12" size={120} />
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-24 opacity-20">
            <Inbox size={64} className="mx-auto text-gray-500" />
            <p className="font-black uppercase tracking-[0.4em] mt-4 text-white">No Profiles Found</p>
          </div>
        )}
      </div>

      {/* 3. FIXED PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-[#16161a] rounded-xl px-2 py-1 border border-white/5">
            <select 
                className="bg-transparent text-[10px] font-black text-amber-500 p-2 outline-none"
                value={rowsPerPage}
                onChange={(e) => {setRowsPerPage(+e.target.value); setPage(0);}}
            >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
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