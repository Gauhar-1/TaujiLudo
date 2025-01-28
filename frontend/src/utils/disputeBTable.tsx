import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {  DisputeResult} from "./action";
import { API_URL } from "./url";

interface Column {
  id: "no" | "battleId" | "entry" | "prize" | "commission" |"joinedAt" | "action" ;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "no", label: "#" },
  { id: "battleId", label: "Battle ID", minWidth: 220 },
  { id: "entry", label: "Entry Fee", minWidth: 170 },
  { id: "prize", label: "Prize", minWidth: 120,  },
  { id: "commission", label: "Admin Commission", minWidth: 190,  },
  { id: "joinedAt", label: "Created At", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 170 },
];

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [rows, setRows] = useState<Data[]>([]);

  // Fetch battles data
  useEffect(() => {
    const runningBattle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/battles`, { params : { status: "canceled" }});
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
                <DisputeResult battleId={profile._id}></DisputeResult>
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleSort = (columnId: string) => {
    const isAsc = sortColumn === columnId && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(columnId);

    const sortedRows = [...rows].sort((a, b) => {
      const valueA = a[columnId as keyof Data];
      const valueB = b[columnId as keyof Data];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return isAsc ? valueA - valueB : valueB - valueA;
      } else if (columnId === "joinedAt") {
        const dateA = new Date(valueA as string);
        const dateB = new Date(valueB as string);
        return isAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
    setRows(sortedRows);
  };

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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full overflow-hidden p-4">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded-md w-54"
          onChange={handleSearch}
        />
        <button
          className="p-2 bg-gray-200 rounded-md"
          onClick={() => {
            const columnId = sortColumn || "no";
            handleSort(columnId);
          }}
        >
          {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
        </button>
      </div>

      <div className="overflow-y-auto shadow-md relative max-h-[440px]">
  <div className="flex bg-gray-200 text-center border-b">
    {columns.map((column) => (
      <div
        key={column.id}
        className={`text-sm font-semibold p-2 flex-1`}
        style={{
          minWidth: column.minWidth || 100,
          textAlign: column.align || "left",
        }}
      >
        {column.label}
      </div>
    ))}
  </div>

  {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
    <div key={row.battleId} className="flex border-b text-center">
      {columns.map((column) => {
        const value = row[column.id as keyof Data];
        
        return (
          <div
            key={column.id}
            className={`text-sm p-2 flex-1`}
            style={{
              minWidth: column.minWidth || 100,
              textAlign: column.align || "left",
            }}
          >
            {column.format && typeof value === "number" ? column.format(value) : value}
          </div>
        );
      })}
    </div>
  ))}
</div>
<div className="mt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            {filteredRows.length} rows
          </div>
          <div className="flex gap-4">
            <select
              className="border p-2 rounded-md"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={100}>100</option>
            </select>
            <button
              className="border p-2 rounded-md"
              onClick={() => handleChangePage({}, page - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              className="border p-2 rounded-md"
              onClick={() => handleChangePage({}, page + 1)}
              disabled={page * rowsPerPage + rowsPerPage >= filteredRows.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
