import { 
  Trophy, 
  Sword, 
  BadgeIndianRupee, 
  Search, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { ViewResult } from "./action";
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
        const response = await axios.get(`${API_URL}/api/auth/battles`, { params : { status: "completed" }});
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
                <ViewResult battleId={profile._id}></ViewResult>
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
      
      {/* HEADER HUD */}
      <div className="sticky top-0 z-20 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Settled Battles</h2>
            </div>
            <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    {filteredRows.length} Matches
                </span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by ID or amount..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CARD LIST */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.battleId} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative group">
            
            {/* Card Top: Commission & Date */}
            <div className="p-5 flex justify-between items-center bg-gradient-to-r from-amber-600/[0.05] to-transparent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                   <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1 text-opacity-70">Admin Profit</p>
                  <p className="text-lg font-black text-white italic leading-none">₹{row.commission}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-gray-500 mb-1">
                  <Clock size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Settled At</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400">{row.joinedAt.split(',')[0]}</p>
              </div>
            </div>

            {/* Financial Detail Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 border-y border-white/5">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                      <Sword size={10} /> Entry Pot
                    </p>
                    <p className="text-sm font-black text-gray-300 italic">₹{row.entry}</p>
                </div>
                <div className="space-y-1 text-right border-l border-white/5 pl-4">
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Trophy size={10} /> User Prize
                    </p>
                    <p className="text-sm font-black text-emerald-500 italic">₹{row.prize}</p>
                </div>
            </div>

            {/* System Info Footer */}
            <div className="px-6 py-3 flex justify-between items-center bg-black/20">
               <div className="flex items-center gap-2">
                 <span className="text-[8px] font-black text-gray-700 uppercase">Battle ID:</span>
                 <span className="text-[9px] font-mono text-gray-500 tracking-tighter">
                   {row.battleId.slice(-12).toUpperCase()}
                 </span>
               </div>
               <div className="w-24">
                  {row.action}
               </div>
            </div>
            
            {/* Background Icon Watermark */}
            <BadgeIndianRupee className="absolute -right-4 -bottom-4 text-white/[0.02]" size={100} />
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <Sword size={60} className="mx-auto" />
            <p className="font-black uppercase tracking-[0.3em] mt-4">No results found</p>
          </div>
        )}
      </div>

      {/* FIXED FOOTER HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-2xl">
          <div className="bg-[#16161a] rounded-xl px-2 py-1 border border-white/5">
            <select 
                className="bg-transparent text-[10px] font-black text-amber-500 p-2 outline-none"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
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
              className="p-2.5 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-90 transition-all"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="flex flex-col items-center min-w-[40px]">
                <span className="text-xs font-black text-white italic leading-none">{page + 1}</span>
                <span className="text-[7px] font-bold text-gray-600 uppercase mt-1">Page</span>
            </div>
            <button 
              disabled={page * rowsPerPage + rowsPerPage >= filteredRows.length}
              onClick={() => setPage(page + 1)}
              className="p-2.5 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-90 transition-all"
            >
              <ChevronRight size={22} />
            </button>
          </div>
      </div>

    </div>
  );
};
