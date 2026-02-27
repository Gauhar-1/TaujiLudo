import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { Sword, Zap, Eye } from "lucide-react";
import { API_URL } from "../utils/url";

interface Battle {
  _id: string;
  player1Name: string;
  player2Name: string;
  player1: string;
  player2: string;
  amount: number;
  prize: number;
}

interface RunningBattleProps {
  battle: Battle;
}

export const RunningBattle = ({ battle }: RunningBattleProps) => {
  const { userId, setBattleId, name } = useUserContext();

  // Professional prize calculation display
  const prizePool = battle.amount * 2 - battle.amount * 0.05;
  const isParticipant = userId === battle.player1 || userId === battle.player2;

  const handleLost = async()=>{
     
    try{
      const response = await axios.post(`${API_URL}/api/auth/battles/inBattle/lost`, { 
         battleId : battle?._id ,
         userId
        });
      if(!response.data){
        console.log("response not found");
      }
    }
    catch(err){
      console.log("Error: "+ err);
    }
  }

  return (
    <div className="mx-4 my-2 relative group">
      {/* Live Status Badge */}
      <div className="absolute -top-2 left-6 z-10 bg-red-600 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg shadow-red-900/20">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-[8px] font-black text-white uppercase tracking-widest">Live Match</span>
      </div>

      <div className="bg-[#16161a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-white/10">
        <div className="p-4 flex items-center justify-between">
          
          {/* Player 1 Info */}
          <div className="flex flex-col items-center gap-2 w-28">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Zap size={20} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-tight truncate w-full text-center">
              {battle.player1Name}
            </span>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-bold text-gray-500 uppercase tracking-tighter">Entry</span>
              <span className="text-[10px] font-black text-gray-300 italic">₹{battle.amount}</span>
            </div>
          </div>

          {/* VS Centerpiece */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <div className="bg-[#1f1f25] p-2 rounded-full border border-white/5 shadow-inner">
                <Sword size={18} className="text-red-500 rotate-45" />
              </div>
              <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full animate-pulse" />
            </div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1">Vs</span>
          </div>

          {/* Player 2 Info */}
          <div className="flex flex-col items-center gap-2 w-28">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Zap size={20} className="text-purple-500" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-tight truncate w-full text-center">
              {battle.player2Name}
            </span>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-bold text-purple-400 uppercase tracking-tighter">Winning</span>
              <span className="text-[10px] font-black text-emerald-500 italic flex items-center">
                ₹{prizePool}
              </span>
            </div>
          </div>
        </div>

        {/* Participant Action Button */}
        {isParticipant && (
         <div className="px-4 pb-4 flex flex-col gap-2">
  {/* Primary Action: Re-entry */}
  <button
    onClick={() => {
      setBattleId(battle._id);
      window.location.href = `${import.meta.env.VITE_LUDO_SERVICE_URL}/waiting/${battle._id}?userId=${userId}&name=${encodeURIComponent(name)}`;
    }}
    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#0b0b0d] py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 group"
  >
    <Eye size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
    <span className="text-[11px] font-black uppercase tracking-[0.15em]">Enter Arena</span>
  </button>

  {/* Secondary Action: Danger Zone */}
  <button 
    onClick={() => {
      if(window.confirm("Surrender Battle? This will award the prize to your opponent.")) {
        handleLost();
      }
    }}
    className="w-full bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-gray-500 hover:text-red-500 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
  >
    <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100">
      <span className="text-[9px] font-bold uppercase tracking-widest">I admit defeat</span>
    </div>
  </button>
</div>
        )}
      </div>
    </div>
  );
};