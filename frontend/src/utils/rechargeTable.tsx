import { Search, Wallet, Trophy, UserCircle, Phone, Hash, IndianRupee, History, ChevronLeft, ChevronRight, } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {  AddMoney,  Transaction } from "./action";
import { useUserContext } from "../hooks/UserContext";
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
  const { phoneNumber, setProfile } = useUserContext();
  

  // Fetch battles data
  useEffect(() => {
    const runningBattle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/findProfile`, { params : { phoneNumber }});
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.createdAt).toLocaleString();
          setProfile(profile);
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
              <Transaction userId={profile.userId}></Transaction>
              <AddMoney profile={profile}></AddMoney>
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
    <div className="w-full max-w-md mx-auto font-sans bg-[#0b0b0d] min-h-screen pb-24">
      
      {/* Search HUD */}
      <div className="sticky top-0 z-30 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-amber-500">Wallet Desk</h2>
            <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Live Sync</span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by ID or name..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 transition-all shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User Action Cards */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.userId} className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            
            {/* Header: User Summary */}
            <div className="p-6 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-[1.2rem] bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-900/20">
                    <div className="h-full w-full bg-[#16161a] rounded-[1.1rem] flex items-center justify-center">
                        <UserCircle size={28} className="text-amber-500" />
                    </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">{row.player1Name}</h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={10} />
                        <span className="text-[10px] font-bold tracking-widest">{row.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Hash size={10} />
                        <span className="text-[9px] font-mono tracking-tighter uppercase italic">{row.userId.slice(-10)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</p>
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[8px] font-black uppercase">Active</span>
              </div>
            </div>

            {/* Wallet & Stats Bento Grid */}
            <div className="px-6 pb-6">
                <div className="bg-[#1f1f25] border border-white/5 rounded-[1.8rem] p-4 flex justify-between items-center mb-4 shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                            <IndianRupee size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Available Balance</p>
                            <p className="text-xl font-black italic text-white leading-none mt-1">₹{row.wallet}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-black text-gray-600 uppercase">Referral Code</span>
                        <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-black text-gray-400">{row.referal}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                        <Trophy size={16} className="text-emerald-500" />
                        <div>
                            <p className="text-[10px] font-black text-white italic">{row.gameWon}</p>
                            <p className="text-[7px] font-bold text-gray-600 uppercase tracking-tighter leading-none">Victories</p>
                        </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                        <History size={16} className="text-red-500" />
                        <div>
                            <p className="text-[10px] font-black text-white italic">{row.gameLost}</p>
                            <p className="text-[7px] font-bold text-gray-600 uppercase tracking-tighter leading-none">Defeats</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Zone */}
            <div className="px-6 py-4 bg-black/20 border-t border-white/5">
                <div className="flex flex-col gap-2">
                    {row.action}
                </div>
            </div>

            {/* Watermark */}
            <Wallet className="absolute -right-4 -bottom-4 text-white/[0.02] -rotate-12" size={100} />
          </div>
        ))}
      </div>

      {/* FIXED PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-2 bg-[#16161a] p-1 rounded-xl border border-white/5">
            <select 
                className="bg-transparent text-[10px] font-black text-amber-500 p-2 outline-none"
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
              className="p-3 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-xs font-black text-white italic leading-none">{page + 1}</span>
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
