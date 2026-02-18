import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./url";
import { Search, Sword, Zap, Clock, IndianRupee, ChevronLeft, ChevronRight, History, Filter } from "lucide-react";


interface Data {
  no: number;
  battleId: string;
  player1Name: string;
  player2Name: string;
  amount: number;
  status: string;
  joinedAt: string;
}

function createData(
  no: number,
  battleId: string,
  player1Name: string,
  player2Name: string,
  amount: number,
  status: string,
  joinedAt: string
): Data {
  return { no, battleId, player1Name, player2Name, amount, status, joinedAt };
}

export const StickyTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rows, setRows] = useState<Data[]>([]);

  // Fetch battles data
  useEffect(() => {
    const runningBattle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/battles/runningBattle`);
        const fetchedBattles = response.data.map((battle: any, index: number) => {
          const date = new Date(battle.createdAt).toLocaleString();
          return createData(
            index + 1,
            battle._id,
            battle.player1Name || "",
            battle.player2Name || "",
            battle.amount || 0,
            battle.status || "",
            date
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
      row.player1Name.toLowerCase().includes(query) ||
      row.player2Name.toLowerCase().includes(query) ||
      row.amount.toString().toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query) ||
      row.joinedAt.toLowerCase().includes(query)
    );
  };

  const getStatusStyle = (status: string) => {
    if (status === "in-progress") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    if (status === "pending") return "text-red-500 bg-red-500/10 border-red-500/20";
    return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  };

  const filteredRows = rows.filter(filterEachRow);

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-[60vh] pb-10">
      
      {/* SEARCH & FILTER HUD */}
      <div className="p-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search active battles..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-amber-500/50 transition-all shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {filteredRows.length} Matches Live
            </p>
          </div>
          <button 
             onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
             className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 bg-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/10"
          >
            Sort Time
          </button>
        </div>
      </div>

      {/* CARD LIST VIEW */}
      <div className="px-4 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.battleId} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden group">
            
            {/* Top Row: Meta Info */}
            <div className="flex justify-between items-center mb-6">
                <div className={`px-3 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(row.status)}`}>
                    {row.status}
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{row.joinedAt.split(',')[1]}</span>
                </div>
            </div>

            {/* Main Action: Player vs Player */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col items-center gap-2 w-28">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-900/10">
                        <Zap size={18} className="text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase truncate text-center w-full tracking-tight">{row.player1Name}</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-[#1f1f25] p-2.5 rounded-full border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                        <Sword size={16} className="text-red-500" />
                    </div>
                    <span className="text-[8px] font-black text-gray-700 uppercase mt-1 tracking-[0.2em]">Vs</span>
                </div>

                <div className="flex flex-col items-center gap-2 w-28">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-900/10">
                        <Zap size={18} className="text-purple-500" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase truncate text-center w-full tracking-tight">{row.player2Name}</span>
                </div>
            </div>

            {/* Entry Amount Card */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                        <IndianRupee size={12} className="text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[7px] font-black text-gray-600 uppercase leading-none">Entry Stake</p>
                        <p className="text-xs font-black text-white italic">₹{row.amount}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-black text-gray-700 uppercase">Battle ID</p>
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter italic">#{row.battleId.slice(-8)}</p>
                </div>
            </div>

            {/* Background Accent */}
            <History className="absolute -right-4 -bottom-4 text-white/[0.02] -rotate-12" size={80} />
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
             <Filter size={48} className="mx-auto" />
             <p className="font-black uppercase tracking-widest mt-2">No matches found</p>
          </div>
        )}
      </div>

      {/* PAGINATION HUD */}
      <div className="mt-8 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#16161a] p-1.5 rounded-xl border border-white/5">
             <select 
                className="bg-transparent text-[10px] font-black text-amber-500 p-1 outline-none"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
             >
                <option value={10}>10</option>
                <option value={25}>25</option>
             </select>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-2 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-90 transition-all"
             >
                <ChevronLeft size={20} />
             </button>
             <span className="text-xs font-black text-white italic">{page + 1}</span>
             <button 
                disabled={page * rowsPerPage + rowsPerPage >= filteredRows.length}
                onClick={() => setPage(page + 1)}
                className="p-2 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-90 transition-all"
             >
                <ChevronRight size={20} />
             </button>
          </div>
      </div>
    </div>
  );
};
