import {  Search, Users, Wallet, Trophy, Phone, ShieldAlert, History } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { Accept, Blockplayer, Transaction } from "./action";
import { API_URL } from "./url";

interface Column {
  id: "no" | "userId" | "player1Name" | "mobile" | "wallet" | "referal" | "gameWon" | "gameLost" | "joinedAt" | "action" ;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "no", label: "#" },
  { id: "userId", label: "User ID", minWidth: 220 },
  { id: "player1Name", label: "Player1", minWidth: 170 },
  { id: "mobile", label: "mobile No.", minWidth: 170 },
  { id: "wallet", label: "Wallet", minWidth: 120,  },
  { id: "referal", label: "Referal Code", minWidth: 170 },
  { id: "gameWon", label: "Game Won", minWidth: 170 },
  { id: "gameLost", label: "Game Lost", minWidth: 170 },
  { id: "joinedAt", label: "Joined At", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 170 },
];

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
        const response = await axios.get(`${API_URL}/api/auth/getProfiles`);
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
              <Transaction phoneNumber={profile.phoneNumber} userId={profile.userId} ></Transaction>
              <Accept></Accept>
              <Blockplayer userId={profile.userId}></Blockplayer>
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


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <div className="sticky top-0 z-20 bg-[#0b0b0d]/95 backdrop-blur-md p-4 space-y-4 border-b border-white/5">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-amber-500">Player Directory</h2>
            <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{filteredRows.length} Total</span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name, ID or mobile..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-amber-500/50 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MOBILE CARD GRID */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.userId} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up">
            
            {/* Card Header: User Main Info */}
            <div className="p-5 flex justify-between items-start bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Users className="text-amber-500" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{row.player1Name}</h3>
                  <p className="text-[10px] font-mono text-gray-500 italic">UID: {row.userId.slice(-8).toUpperCase()}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                    <Phone size={10} />
                    <span className="text-[10px] font-bold tracking-widest">{row.mobile}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Joined At</p>
                <p className="text-[10px] font-bold text-gray-400">{row.joinedAt}</p>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="px-5 py-4 grid grid-cols-3 gap-2 border-t border-b border-white/5">
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02]">
                <Wallet size={14} className="text-blue-500 mb-1" />
                <span className="text-xs font-black text-white italic">₹{row.wallet}</span>
                <span className="text-[7px] font-black text-gray-600 uppercase tracking-tighter">Wallet</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02]">
                <Trophy size={14} className="text-emerald-500 mb-1" />
                <span className="text-xs font-black text-emerald-500 italic">{row.gameWon}</span>
                <span className="text-[7px] font-black text-gray-600 uppercase tracking-tighter">Wins</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02]">
                <ShieldAlert size={14} className="text-red-500 mb-1" />
                <span className="text-xs font-black text-red-500 italic">{row.gameLost}</span>
                <span className="text-[7px] font-black text-gray-600 uppercase tracking-tighter">Loss</span>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="px-5 py-3 flex justify-between items-center bg-black/20">
               <div className="flex items-center gap-2">
                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Referal:</span>
                 <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">{row.referal}</span>
               </div>
               <div className="flex items-center gap-1 text-gray-600">
                  <History size={12} />
                  <span className="text-[8px] font-black uppercase">Activity Log</span>
               </div>
            </div>

            {/* ACTION SECTION */}
            <div className="p-4 bg-white/[0.01]">
              <div className="flex justify-around items-center">
                 {row.action}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* FOOTER PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-lg border-t border-white/5 flex justify-between items-center">
          <select 
            className="bg-[#16161a] text-[10px] font-black text-white p-2 rounded-xl outline-none border border-white/5"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
          >
            <option value={10}>10 Items</option>
            <option value={25}>25 Items</option>
            <option value={100}>100 Items</option>
          </select>
      </div>
    </div>
  );
};
