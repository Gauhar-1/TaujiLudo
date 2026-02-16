import { useEffect, useState } from "react";
import { BettingCard } from "./bettingCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, SOCKET_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { io } from "socket.io-client";
import { RunningBattle } from "./runningBattleCard";
import { toast } from "react-toastify";
import { Trophy, Sword, Info, PlusCircle, History, Zap } from "lucide-react"; // Recommended: lucide-react for icons

export const socket = io(`${SOCKET_URL}`, {
  transports: ["websocket"],
  path: "/socket.io/",
  withCredentials: true,
});

export const HomePage = () => {
  const navigate = useNavigate();
  const { userId, name, battleId } = useUserContext();
  const [amount, setAmount] = useState<number>(0);
  const [info, setInfo] = useState("");
  const [isFetching, setIsFetching] = useState<Boolean>(false);
  const [onGoingB, setOnGoingB] = useState([]);
  const [pendingB, setPendingB] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ... (Logic remains identical to your provided code) ...
  const getLocalStorageValue = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };

  const [setClicked] = useState(() => getLocalStorageValue("setClicked", false));
  const [battleCreated] = useState(() => getLocalStorageValue("battleCreated", false));
  const [id] = useState(() => getLocalStorageValue("userId", userId));
  const [userName] = useState(() => getLocalStorageValue("name", "Noobie"));

  const updateLocalStorage = (key: string, value: any) => {
    const existingValue = JSON.parse(localStorage.getItem(key) || "null");
    if (existingValue !== value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  useEffect(() => {
    updateLocalStorage("setClicked", setClicked);
    updateLocalStorage("battleCreated", battleCreated);
    updateLocalStorage("userId", id);
    if (userName !== "false") {
      updateLocalStorage("name", userName);
    }
  }, [setClicked, battleCreated, id, userName]);

  useEffect(() => {
    const handleInfoBar = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/getAdmin`);
        if (response.data) {
          const { adminSetting } = response.data.admin[0];
          setInfo(adminSetting.content);
        }
      } catch (err) { console.log(err); }
    };
    handleInfoBar();
  }, []);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/battles/pending`);
        if (res?.data) setPendingB(res.data);
      } catch (e) { console.error(e); }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOngoing = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(`${API_URL}/api/auth/battles`, { params: { status: "in-progress" } });
        if (res?.data) setOnGoingB(res.data);
      } catch (e) { console.error(e); }
      finally { setIsFetching(false); }
    };
    fetchOngoing();
    const interval = setInterval(fetchOngoing, 10000);
    return () => clearInterval(interval);
  }, []);

  const createBattle = () => {
    if (!amount || amount % 50 !== 0) {
      toast.warning("⚠️ Enter a multiple of 50");
      return;
    }
    const battleData = { name, userId, amount };
    setIsLoading(true);
    socket.emit("createBattle", battleData, (res: any) => {
      setIsLoading(false);
      if (res?.status === 200) toast.success("Battle Live!");
      else toast.error(res?.message || "Error");
    });
  };

  const fakeBattle = [
    { "_id": "1", "player1Name": "No popular game", "player2Name": "Pushpa", "amount": 100 },
    { "_id": "2", "player1Name": "राधे राधे 100", "player2Name": "Banna ji", "amount": 500 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0f0f12]">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f12] min-h-screen w-full max-w-md mx-auto pt-8 text-gray-100 font-sans shadow-2xl overflow-hidden">
      {/* Top Ticker */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 py-2 px-4 shadow-lg overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block text-[10px] font-bold uppercase tracking-widest text-black">
           🏆 Commission 5% | Refer & Earn 2% | Instant Withdrawals 🏆
        </div>
      </div>

      <div className="px-5 pt-6 pb-24">
        {/* Header Info Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 to-indigo-900 rounded-2xl p-4 shadow-xl mb-8 border border-white/10">
          <div className="relative z-10 flex items-start gap-3">
            <Info size={20} className="text-purple-200 mt-1" />
            <p className="text-sm font-medium leading-relaxed italic text-purple-50">{info || "Welcome to the Arena. Play Fair, Win Big!"}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Trophy size={100} />
          </div>
        </div>

        {/* Create Battle Section */}
        <div className="bg-[#1a1a1f] rounded-2xl p-6 border border-white/5 shadow-inner mb-8">
          <h2 className="text-center font-black text-xl tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            CHALLENGE THE WORLD
          </h2>
          
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full bg-[#25252b] border-2 border-transparent focus:border-green-500 outline-none rounded-xl py-3 pl-8 pr-4 text-white font-bold transition-all"
                onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <button
              onClick={createBattle}
              className="bg-green-500 hover:bg-green-400 active:scale-95 text-black font-black px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              SET <PlusCircle size={18} />
            </button>
          </div>
          
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Min: ₹50</span>
            <span>Step: ₹50</span>
          </div>
        </div>

        {/* Tab Headers: Open Battles */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500/20 p-1.5 rounded-lg text-orange-500">
                <Sword size={20} />
              </div>
              <h3 className="font-bold text-lg">Open Arena</h3>
            </div>
            <button 
                onClick={() => navigate("/rules")}
                className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20"
            >
              RULES <Info size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {pendingB?.length > 0 ? (
              pendingB.map((battle: any) => <BettingCard key={battle._id} battle={battle} />)
            ) : (
              <div className="text-center py-8 bg-[#1a1a1f] rounded-xl border border-dashed border-white/10 text-gray-500 text-sm">
                No active challenges. Create one!
              </div>
            )}
          </div>
        </section>

        {/* Tab Headers: Running Battles */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-500">
              <History size={20} />
            </div>
            <h3 className="font-bold text-lg">In-Progress</h3>
            {isFetching && <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping ml-2" />}
          </div>

          <div className="space-y-4 opacity-90">
            {onGoingB?.map((battle: any) => (
              <RunningBattle key={battle._id} battle={battle} />
            ))}
            
            {/* Fake/Demo Battles with slight transparency */}
            <div className="border-t border-white/5 pt-4 mt-4">
               <p className="text-[10px] text-gray-600 font-bold uppercase mb-3 text-center">Recent Live Action</p>
               <div className="space-y-3 grayscale-[0.3]">
                 {fakeBattle.map((battle: any) => (
                   <RunningBattle key={battle._id} battle={battle} />
                 ))}
               </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Bottom Nav Placeholder - Recommended for Mobile UX */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1a1f]/80 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-6 max-w-md mx-auto">
          <Zap className="text-purple-500" />
          <Trophy className="text-gray-500 opacity-50" />
          <PlusCircle size={32} className="text-green-500 -mt-8 bg-[#0f0f12] rounded-full border-4 border-[#0f0f12]" />
          <History className="text-gray-500 opacity-50" />
          <Info className="text-gray-500 opacity-50" />
      </div>
    </div>
  );
};