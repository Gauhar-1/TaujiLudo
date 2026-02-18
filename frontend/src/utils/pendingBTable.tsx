import { Search, Sword, Clock, IndianRupee, ChevronLeft, ChevronRight, User, Hash, Filter } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { DeleteBattle} from "./action";
import { API_URL } from "./url";



interface Data {
  no: number;
  battleId: string;
  creator: string;
  entry: number;
  prize: number;
  joinedAt: string;
  action: ReactElement;
}

function createData(
    no: number,
    battleId: string,
    creator: string,
    entry: number,
    prize: number,
    joinedAt: string,
    action: ReactElement,
): Data {
  return {
    no,
    battleId,
    creator,
    entry,
    prize,
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
        const response = await axios.get(`${API_URL}/api/auth/battles`, { params : { status: "pending" }});
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.createdAt).toLocaleString();
          return createData(
            index + 1,
            profile._id,
            profile.player1Name || "",
            profile.amount || "",
            ((profile.amount * 2) - (profile.amount * 0.05)),
            date,
            <div className="flex gap-2">
                <DeleteBattle battleId={profile._id}></DeleteBattle>
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
      
      {/* HEADER SECTION */}
      <div className="sticky top-0 z-20 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sword className="text-amber-500" size={20} />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Lobby Queue</h2>
            </div>
            <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                    {filteredRows.length} Waiting
                </span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search Creator or ID..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 transition-all shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* BATTLE CARD LIST */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.battleId} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative transition-all hover:border-white/10">
            
            {/* Top Row: User & Timing */}
            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 text-gray-400">
                   <User size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{row.creator}</h3>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Hash size={10} />
                    <span className="text-[9px] font-mono tracking-tighter uppercase italic">{row.battleId.slice(-12)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-amber-500/50 mb-1">
                    <Clock size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest italic animate-pulse">Open</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500">{row.joinedAt.split(',')[1]}</p>
              </div>
            </div>

            {/* Prize & Entry Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-white/[0.02] border-y border-white/5">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center gap-1">
                      <IndianRupee size={10} /> Entry Fee
                    </p>
                    <p className="text-sm font-black text-white italic">₹{row.entry}</p>
                </div>
                <div className="space-y-1 text-right border-l border-white/5 pl-4">
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center justify-end gap-1">
                      Potential Prize
                    </p>
                    <p className="text-sm font-black text-emerald-500 italic">₹{row.prize}</p>
                </div>
            </div>

            {/* MODERATION FOOTER */}
            <div className="p-4 bg-gradient-to-t from-red-600/[0.03] to-transparent flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 px-2">
                    <Filter size={14} className="text-gray-700" />
                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic">Moderator Actions</span>
                </div>
                <div className="w-32">
                   {row.action}
                </div>
            </div>
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <Sword size={60} className="mx-auto" />
            <p className="font-black uppercase tracking-[0.3em] mt-4">No Pending Battles</p>
          </div>
        )}
      </div>

      {/* FIXED PAGINATION HUD */}
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

          <div className="flex items-center gap-3">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-3 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center min-w-[40px]">
                <span className="text-xs font-black text-amber-500 italic leading-none">{page + 1}</span>
                <span className="text-[7px] font-bold text-gray-600 uppercase mt-1">Page</span>
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