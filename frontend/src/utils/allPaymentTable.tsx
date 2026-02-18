import React, {  useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./url";
import { ArrowDownward, ArrowUpward, Search, FilterList, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IndianRupee } from "lucide-react";

interface Data {
  no: number;
  paymentId: string;
  userId: string;
  phoneNumber: string;
  amount: number;
  type: string;
  status: string;
  joinedAt: string;
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
  };
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
        const response = await axios.get(`${API_URL}/api/auth/allTransaction`);
        const fetchedBattles = response.data.map((profile: any, index: number) => {
          const date = new Date(profile.date).toLocaleString();
          return createData(
            index + 1,
            profile._id,
            profile.userId,
            profile.phoneNumber || "N/A",
            profile.amount || "",
            profile.type,
            profile.status,
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

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'success' || s === 'completed') return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (s === 'pending') return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  

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

 return (
    <div className="w-full max-w-md mx-auto font-sans">
      
      {/* Search & Sort HUD */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" fontSize="small" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between items-center px-1">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            {filteredRows.length} Entries Found
          </p>
          <button 
            className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 active:scale-95 transition-all"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort {sortOrder === "asc" ? <ArrowUpward fontSize="inherit" /> : <ArrowDownward fontSize="inherit" />}
          </button>
        </div>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div 
            key={row.paymentId} 
            className="bg-[#16161a] border border-white/5 rounded-[1.5rem] p-5 shadow-xl hover:border-white/10 transition-all active:scale-[0.98]"
          >
            {/* Row 1: Type & Amount */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${row.type === 'deposit' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'}`}>
                   <IndianRupee fontSize="small" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Transaction</p>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{row.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black italic text-white leading-none">₹{row.amount}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(row.status)}`}>
                  {row.status}
                </span>
              </div>
            </div>

            {/* Row 2: User Meta */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-white/5 mt-2">
              <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter mb-0.5">Mobile Number</p>
                <p className="text-[11px] font-bold text-gray-300 tracking-wide">{row.phoneNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter mb-0.5">Created At</p>
                <p className="text-[11px] font-bold text-gray-400 tracking-wide">{row.joinedAt}</p>
              </div>
            </div>

            {/* Row 3: ID Footer */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 opacity-50">
               <p className="text-[8px] font-mono text-gray-500">ID: {row.paymentId.slice(-12).toUpperCase()}</p>
               <p className="text-[8px] font-mono text-gray-500">UID: {row.userId.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        ))}

        {filteredRows.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <FilterList sx={{ fontSize: 60 }} />
            <p className="font-black uppercase tracking-[0.3em] mt-4">No Data</p>
          </div>
        )}
      </div>

      {/* MOBILE PAGINATION HUD */}
      <div className="mt-8 bg-[#1a1a1f] border border-white/10 p-4 rounded-3xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <select 
            className="bg-[#0b0b0d] border border-white/5 text-[10px] font-black text-white p-2 rounded-xl outline-none"
            value={rowsPerPage}
            onChange={(e) => {setRowsPerPage(+e.target.value); setPage(0);}}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-[10px] font-bold text-gray-600 uppercase">Per Page</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl bg-white/5 text-white disabled:opacity-20 active:scale-90 transition-all"
          >
            <ChevronLeft />
          </button>
          <span className="text-xs font-black text-amber-500 italic">
            {page + 1} / {Math.ceil(filteredRows.length / rowsPerPage)}
          </span>
          <button 
            disabled={page * rowsPerPage + rowsPerPage >= filteredRows.length}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl bg-white/5 text-white disabled:opacity-20 active:scale-90 transition-all"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};