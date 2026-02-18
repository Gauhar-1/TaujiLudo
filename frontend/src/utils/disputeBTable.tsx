import { 
  AlertTriangle, 
  Search, 
  Clock, 
  Sword, 
  Trophy, 
  Gavel, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {  DisputeResult} from "./action";
import { API_URL } from "./url";



interface Data {
  no: number;
  battleId: string;
  entry: number;
  prize: number;
  commission: number;
  joinedAt: string;
  action: ReactElement;
}

function createData(
    no: number,
    battleId: string,
    entry: number,
    prize: number,
    commission: number,
    joinedAt: string,
    action: ReactElement,
): Data {
  return {
    no,
    battleId,
    entry,
    prize,
    commission,
    joinedAt,
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
        const response = await axios.get(`${API_URL}/api/auth/battles`, { params : { status: "disputed" }});
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.createdAt).toLocaleString();
          return createData(
            index + 1,
            profile._id,
            profile.amount || "",
            Math.floor((profile.amount * 2) - (profile.amount * 0.05)),
            Math.ceil(profile.amount * 0.05),
            date,
            <div className="flex gap-2">
                <DisputeResult battleId={profile._id}></DisputeResult>
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
      row.battleId.toLowerCase().includes(query) ||
      row.entry.toString().toLowerCase().includes(query) ||
      row.entry.toString().toLowerCase().includes(query) ||
      row.prize.toString().toLowerCase().includes(query) ||
      row.joinedAt.toLowerCase().includes(query)
    );
  };

  const filteredRows = rows.filter(filterEachRow);

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-screen pb-24">
      
      {/* SEARCH & FILTER HUD */}
      <div className="sticky top-0 z-20 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-red-500/20 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-red-500 p-1.5 rounded-lg">
                    <AlertTriangle className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Dispute Desk</h2>
            </div>
            <div className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                    {filteredRows.length} Active Disputes
                </span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search Battle ID..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-red-500/50 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* DISPUTE CARD LIST */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.battleId} className="bg-[#16161a] border-l-4 border-l-red-600 border-y border-r border-white/5 rounded-r-[2rem] rounded-l-lg overflow-hidden shadow-2xl relative">
            
            {/* Card Header */}
            <div className="p-5 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Gavel size={14} className="text-red-500" />
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Investigation Required</span>
                </div>
                <p className="text-[11px] font-mono text-gray-400">ID: {row.battleId.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-gray-600 mb-1">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Opened At</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400">{row.joinedAt.split(',')[1]}</p>
              </div>
            </div>

            {/* Financials Bento Grid */}
            <div className="px-5 py-4 grid grid-cols-2 gap-4 border-y border-white/5 bg-white/[0.01]">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                      <Sword size={10} /> Battle Entry
                    </p>
                    <p className="text-sm font-black text-gray-300 italic">₹{row.entry}</p>
                </div>
                <div className="space-y-1 text-right border-l border-white/5 pl-4">
                    <p className="text-[8px] font-black text-red-400 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Trophy size={10} /> Disputed Prize
                    </p>
                    <p className="text-sm font-black text-red-500 italic">₹{row.prize}</p>
                </div>
            </div>

            {/* Action Area */}
            <div className="p-4 bg-gradient-to-t from-red-600/[0.05] to-transparent flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-700 uppercase leading-none">Platform Fee</span>
                    <span className="text-[10px] font-bold text-gray-500 italic">₹{row.commission}</span>
                </div>
                <div className="w-32 transform hover:scale-105 active:scale-95 transition-all">
                  {row.action}
                </div>
            </div>

            {/* Background Decorative Icon */}
            <AlertTriangle className="absolute -right-4 -top-4 text-red-500/[0.03]" size={100} />
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <Filter size={60} className="mx-auto" />
            <p className="font-black uppercase tracking-[0.3em] mt-4">Clear of Disputes</p>
          </div>
        )}
      </div>

      {/* PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 bg-[#16161a] p-1 rounded-xl border border-white/5">
            <select 
                className="bg-transparent text-[10px] font-black text-red-500 p-2 outline-none"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
            >
                <option value={10}>10 Items</option>
                <option value={25}>25 Items</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-2.5 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:bg-red-600 active:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center px-2">
                <span className="text-xs font-black text-white italic leading-none">{page + 1}</span>
                <span className="text-[7px] font-bold text-gray-600 uppercase leading-none mt-1">Page</span>
            </div>
            <button 
              disabled={page * rowsPerPage + rowsPerPage >= filteredRows.length}
              onClick={() => setPage(page + 1)}
              className="p-2.5 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:bg-red-600 active:text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
      </div>
    </div>
  );
};
