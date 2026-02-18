import {  Search, CreditCard, User, Phone, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {  PaymentReq } from "./action";
import { API_URL } from "./url";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

interface Data {
  no: number;
  paymentId: string;
  userId: string;
  phoneNumber: string;
  amount: number;
  type: string;
  status: string;
  joinedAt: string;
  action: ReactElement;
}

function createData(
    no: number,
    paymentId: string,
    userId: string,
    phoneNumber: string,
    amount: number,
    type: string,
    status: string,
    joinedAt: string,
    action: ReactElement,
): Data {
  return {
    no,
    paymentId,
    userId,
    phoneNumber,
    amount,
    type,
    status,
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
        const response = await axios.get(`${API_URL}/api/auth/reqTransaction`);
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.date).toLocaleString();
          return createData(
            index + 1,
            profile._id,
            profile.userId,
            profile.phoneNumber,
            profile.amount || "",
            profile.type,
            profile.status,
            date,
            <div className="flex gap-2">
                <PaymentReq battleId={profile._id}></PaymentReq>
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
      row.paymentId.toLowerCase().includes(query) ||
      row.userId.toLowerCase().includes(query) ||
      row.phoneNumber.toLowerCase().includes(query) ||
      row.amount.toString().toLowerCase().includes(query) ||
      row.type.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query) ||
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
      
      {/* SEARCH & FILTERS */}
      <div className="sticky top-0 z-30 bg-[#0b0b0d]/95 backdrop-blur-md p-5 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Payment Desk</h2>
            <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    {filteredRows.length} Requests
                </span>
            </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by ID or Mobile..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-blue-500/50 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* REQUEST CARDS */}
      <div className="p-4 space-y-4">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div key={row.paymentId} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative transition-all active:scale-[0.98]">
            
            {/* Type Indicator Bar */}
            <div className={`h-1 w-full ${row.type === 'deposit' ? 'bg-blue-500' : 'bg-red-500'}`} />

            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${row.type === 'deposit' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                   {row.type === 'deposit' ? <ArrowUpward fontSize="large" /> : <ArrowDownward fontSize="large" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Type</span>
                    <span className={`text-[9px] font-black uppercase italic ${row.type === 'deposit' ? 'text-blue-500' : 'text-red-500'}`}>
                        {row.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white italic leading-none">₹{row.amount}</h3>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  {row.status}
                </span>
                <div className="flex items-center justify-end gap-1 mt-2 text-gray-600">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{row.joinedAt.split(',')[1]}</span>
                </div>
              </div>
            </div>

            {/* Data Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-white/[0.02] border-y border-white/5">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={12} />
                        <span className="text-[10px] font-bold tracking-tight">{row.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <User size={12} />
                        <span className="text-[9px] font-mono uppercase tracking-tighter italic">UID: {row.userId.slice(-8)}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                    <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Payment Reference</p>
                    <p className="text-[9px] font-mono text-gray-400">#{row.paymentId.slice(-12).toUpperCase()}</p>
                </div>
            </div>

            {/* ACTION AREA */}
            <div className="p-4 bg-gradient-to-t from-white/[0.02] to-transparent">
               {row.action}
            </div>
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <CreditCard size={60} className="mx-auto" />
            <p className="font-black uppercase tracking-[0.3em] mt-4 text-white">No Pending Requests</p>
          </div>
        )}
      </div>

      {/* FIXED PAGINATION HUD */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b0b0d]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center shadow-2xl">
          <div className="bg-[#16161a] rounded-xl px-2 py-1 border border-white/5">
            <select 
                className="bg-transparent text-[10px] font-black text-blue-500 p-2 outline-none"
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
              className="p-3 bg-white/5 rounded-xl text-gray-400 disabled:opacity-10 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center min-w-[40px]">
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
