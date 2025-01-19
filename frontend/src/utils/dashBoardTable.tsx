import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Column {
  id: "no" | "battleId" | "player1Name" | "player2Name" | "amount" | "status" | "joinedAt";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "no", label: "#" },
  { id: "battleId", label: "Battle ID", minWidth: 190 },
  { id: "player1Name", label: "Player1", minWidth: 170 },
  { id: "player2Name", label: "Player2", minWidth: 170 },
  { id: "amount", label: "Amount", minWidth: 170, align: "right" },
  { id: "status", label: "Status", minWidth: 170, align: "right" },
  { id: "joinedAt", label: "Joined At", minWidth: 170, align: "right" },
];

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
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [rows, setRows] = useState<Data[]>([]);

  // Fetch battles data
  useEffect(() => {
    const runningBattle = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/battles/runningBattle");
        const fetchedBattles = response.data.map((battle: any, index: number) => {
          const date = new Date(battle.createdAt).toLocaleString();
          return createData(
            index + 1,
            battle._id,
            battle.player1Name || "Unknown",
            battle.player2Name || "Unknown",
            battle.amount || 0,
            battle.status || "Unknown",
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
      row.player1Name.toLowerCase().includes(query) ||
      row.player2Name.toLowerCase().includes(query) ||
      row.amount.toString().toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query) ||
      row.joinedAt.toLowerCase().includes(query)
    );
  };

  const filteredRows = rows.filter(filterEachRow);

  const handleChangePage = (event: unknown, newPage: number) => {
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

      <div className="overflow-y-auto max-w-screen shadow-md relative  max-h-[440px]">
        <div className="flex  shadow-md bg-gray-100 p-2 text-center border-b ">
          {columns.map((column) => (
            <div
              key={column.id}
              className="text-sm font-semibold p-2"
              style={{ minWidth: column.minWidth }}
            >
              {column.label}
            </div>
          ))}
        </div>

        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <div
            key={row.battleId}
            className="flex flex-row  px-2   border-b "
          >
            {columns.map((column) => {
              const value = row[column.id as keyof Data];
              const statusClasses =
                column.id === "status"
                  ? value === "pending"
                    ? "text-red-500 ml-12 pl-4 mr-20 font-bold"
                    : value === "in-progress"
                    ? "text-yellow-500 mx-6 font-bold"
                    : ""
                  : "";
                  const no = column.id === "no" ? "pt-4 px-2 " : "";
                  const battleId = column.id === "battleId" ? "h-5 pt-4 px-5 w-80" : "";
                  const player1 = column.id === "player1Name" ? "px-8 mx-2 mr-1 pt-4" : "";
                  const player2 = column.id === "player2Name" ? "px-4 pt-4  mx-20 w-190" : "";
                  const amount = column.id === "amount" ? "px-5 pt-4 mx-6 w-190" : "";
                  const status = column.id === "status" ? "px-16 mx-20  pt-2 text-center " : "";
                  const joinedAt = column.id === "joinedAt" ? "px-12 mx-2  " : "";
              return (
                <div
                  key={column.id}
                  className={`px-2 mt-1 text-center text-sm ${statusClasses} ${no} ${battleId} ${player1} ${player2} ${amount}
                  ${status} ${joinedAt}`}
              
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
