import { Search, ShieldX, Phone, Wallet, Trophy } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {  UnBlock } from "./action";
import { API_URL } from "./url";


interface Data {
  no: number;
  userId: string;
  player1Name: string;
  mobile: string;
  wallet: number;
  referal: string;
  gameWon: string;
  gameLost: string;
  joinedAt: string;
  action: ReactElement;
}

function createData(
  no: number,
  userId: string,
  player1Name: string,
  mobile: string,
  wallet: number,
  referal: string,
  gameWon: string,
  gameLost: string,
  joinedAt: string,
  action: ReactElement,
): Data {
  return {
    no,
    userId,
    player1Name,
    mobile,
    wallet,
    referal,
    gameWon,
    gameLost,
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
        const response = await axios.get(`${API_URL}/api/auth/blockedOnes`);
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.createdAt).toLocaleString();
          return createData(
            index + 1,
            profile.userId,
            profile.name || "",
            profile.phoneNumber || "",
            profile.amount || 0,
            profile.Referal ,
            profile.gameWon,
            profile.gameLost ,
            date,
            <div className="flex gap-2">
              <UnBlock userId = {profile.userId}></UnBlock>
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
      row.player1Name.toLowerCase().includes(query) ||
      row.mobile.toLowerCase().includes(query) ||
      row.wallet.toString().toLowerCase().includes(query) ||
      row.gameWon.toString().toLowerCase().includes(query) ||
      row.referal.toString().toLowerCase().includes(query) ||
      row.gameLost.toString().toLowerCase().includes(query) ||
      row.joinedAt.toLowerCase().includes(query)
    );
  };

  const filteredRows = rows.filter(filterEachRow);


  return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-screen pb-24">
      
      {/* SEARCH HUD */}
      <div className="sticky top-0 z-20 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ShieldX className="text-red-500" size={20} />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Blacklist</h2>
            </div>
            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 text-[10px] font-black uppercase tracking-widest">
                {filteredRows.length} Restricted
            </span>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by ID or Mobile..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-red-500/50 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CARD LIST */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.userId} className="bg-[#16161a] border-l-4 border-l-red-600 border-y border-r border-white/5 rounded-r-[2rem] rounded-l-lg overflow-hidden shadow-2xl animate-slide-up">
            
            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-900/10">
                   <ShieldX className="text-red-500" size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mb-0.5">{row.player1Name}</h3>
                  <p className="text-[9px] font-mono text-gray-500">ID: {row.userId.slice(-10).toUpperCase()}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                    <Phone size={10} />
                    <span className="text-[10px] font-bold tracking-widest">{row.mobile}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Joined</p>
                <p className="text-[10px] font-bold text-gray-400">{row.joinedAt.split(',')[0]}</p>
              </div>
            </div>

            {/* PERFORMANCE GRID */}
            <div className="px-5 py-4 grid grid-cols-3 gap-3 bg-white/[0.02] border-y border-white/5">
                <div className="text-center">
                    <Wallet size={14} className="mx-auto mb-1 text-blue-500" />
                    <p className="text-[10px] font-black text-white">₹{row.wallet}</p>
                    <p className="text-[7px] font-bold text-gray-600 uppercase">Balance</p>
                </div>
                <div className="text-center border-x border-white/5">
                    <Trophy size={14} className="mx-auto mb-1 text-emerald-500" />
                    <p className="text-[10px] font-black text-emerald-500">{row.gameWon}</p>
                    <p className="text-[7px] font-bold text-gray-600 uppercase">Wins</p>
                </div>
                <div className="text-center">
                    <ShieldX size={14} className="mx-auto mb-1 text-red-500" />
                    <p className="text-[10px] font-black text-red-500">{row.gameLost}</p>
                    <p className="text-[7px] font-bold text-gray-600 uppercase">Loss</p>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 flex items-center justify-between bg-gradient-to-t from-red-600/[0.03] to-transparent">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Code:</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-gray-400">{row.referal}</span>
                </div>
                <div className="w-32 active:scale-95 transition-transform">
                   {row.action}
                </div>
            </div>

          </div>
        ))}
      </div>

      

    </div>
  );
};
