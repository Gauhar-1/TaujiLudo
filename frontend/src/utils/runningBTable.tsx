import { Search, Sword, Zap, Clock, IndianRupee, ChevronLeft, ChevronRight, Hash, Key } from "lucide-react";
import React, {  useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./url";

interface Data {
  no: number;
  battleId: string;
  creator: string;
  opponent : string;
  entry: number;
  prize: number;
  ludoCode : string;
  joinedAt: string;
}

function createData(
    no: number,
    battleId: string,
    creator: string,
    opponent : string,
    entry: number,
    prize: number,
    ludoCode : string,
    joinedAt: string,
): Data {
  return {
    no,
    battleId,
    creator,
    opponent,
    entry,
    prize,
    ludoCode,
    joinedAt,
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
        const response = await axios.get(`${API_URL}/api/auth/battles`, { params : { status: "in-progress" }});
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.createdAt).toLocaleString();
          return createData(
            index + 1,
            profile._id,
            profile.player1Name || "",
            profile.player2Name || "",
            profile.amount || "",
            ((profile.amount * 2) - (profile.amount * 0.05)),
            profile.ludoCode,
            date,
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
      row.creator.toLowerCase().includes(query) ||
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
      
      {/* SEARCH & SYSTEM STATUS */}
      <div className="sticky top-0 z-30 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Zap className="text-amber-500 fill-amber-500" size={18} />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Live Hub</h2>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{filteredRows.length} Matches</span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name, ID or code..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ACTIVE BATTLE CARDS */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.battleId} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative transition-all active:scale-[0.98]">
            
            {/* Top Row: IDs & Time */}
            <div className="p-5 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                   <Hash size={12} className="text-gray-600" />
                   <span className="text-[9px] font-mono text-gray-500 tracking-tighter uppercase italic">BID: {row.battleId.slice(-10)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Key size={12} className="text-amber-500/60" />
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                     Code: <span className="text-white select-all">{row.ludoCode}</span>
                   </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-gray-600 mb-1">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Started</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400">{row.joinedAt.split(',')[1]}</p>
              </div>
            </div>

            {/* Matchup Section */}
            <div className="px-6 py-4 flex justify-between items-center bg-white/[0.02] border-y border-white/5">
                <div className="flex flex-col items-center gap-1 w-24">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                        <Zap size={14} />
                    </div>
                    <p className="text-[10px] font-black text-white uppercase truncate text-center w-full">{row.creator}</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-[#1f1f25] p-2 rounded-full border border-white/5 shadow-inner">
                        <Sword size={14} className="text-red-500 rotate-45" />
                    </div>
                    <span className="text-[8px] font-black text-gray-700 uppercase mt-1">Vs</span>
                </div>

                <div className="flex flex-col items-center gap-1 w-24">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500">
                        <Zap size={14} />
                    </div>
                    <p className="text-[10px] font-black text-white uppercase truncate text-center w-full">{row.opponent}</p>
                </div>
            </div>

            {/* Financials Footer */}
            <div className="p-4 bg-gradient-to-t from-white/[0.02] to-transparent grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 text-gray-400">
                        <IndianRupee size={12} />
                    </div>
                    <div>
                        <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Entry Stake</p>
                        <p className="text-xs font-black text-gray-300 italic">₹{row.entry}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-right">
                    <div>
                        <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">Net Prize</p>
                        <p className="text-xs font-black text-emerald-500 italic mt-1">₹{row.prize}</p>
                    </div>
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-500">
                        <Sword size={12} />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-2xl">
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
