import { ArrowDownward, ArrowUpward, Search } from "@mui/icons-material";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "./url";

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
}

const columns: readonly Column[] = [
  { id: "no", label: "#", minWidth: 50 },
  { id: "orderId", label: "Transaction ID", minWidth: 200 },
  { id: "mobile", label: "Mobile No.", minWidth: 150 },
  { id: "type", label: "Type", minWidth: 120 },
  { id: "paymentMethod", label: "Method", minWidth: 120 },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "amount", label: "Amount", minWidth: 120 },
  { id: "wallet", label: "Wallet", minWidth: 100 },
  { id: "joinedAt", label: "Date", minWidth: 180 },
];

interface Data {
  no: number;
  orderId: string;
  mobile: string;
  paymentMethod: string;
  type: string;
  status: string;
  wallet: number;
  amount: number | string;
  joinedAt: string;
}

export const StickyTable: React.FC = () => {
  const [rows, setRows] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<keyof Data>("joinedAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { id } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/transaction`, { params: { userId: id } });
        const mappedData = response.data.map((item: any, index: number) => ({
          no: index + 1,
          orderId: item._id,
          mobile: item.phoneNumber || "N/A",
          paymentMethod: item.paymentMethod || "UPI",
          type: item.type,
          status: item.status,
          amount: item.amount || 0,
          wallet: item.wallet || 0,
          joinedAt: new Date(item.date).toLocaleString(),
        }));
        setRows(mappedData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Handle Sorting Logic
  const handleSort = (columnId: keyof Data) => {
    const isAsc = sortColumn === columnId && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(columnId);
  };

  // Filter & Sort processed data
  const processedRows = useMemo(() => {
    let filtered = rows.filter((row) =>
      Object.values(row).some((val) => 
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, searchQuery, sortColumn, sortOrder]);

  const paginatedRows = processedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Status Badge Helper
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-[500px]">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  onClick={() => handleSort(col.id)}
                  className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  style={{ minWidth: col.minWidth }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.id && (
                      sortOrder === "asc" ? <ArrowUpward style={{ fontSize: 14 }} /> : <ArrowDownward style={{ fontSize: 14 }} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRows.map((row) => (
              <tr key={row.orderId} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-500">{row.no}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.orderId}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{row.mobile}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{row.type}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{row.paymentMethod}</td>
                <td className="px-4 py-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-gray-800">₹{row.amount}</td>
                <td className="px-4 py-4 text-sm text-gray-600">₹{row.wallet}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{row.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-gray-600">
        <div>
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, processedRows.length)} of {processedRows.length} entries
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 outline-none"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[10, 25, 50].map(v => <option key={v} value={v}>Show {v}</option>)}
          </select>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * rowsPerPage >= processedRows.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};