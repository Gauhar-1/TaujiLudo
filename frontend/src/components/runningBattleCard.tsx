import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { Sword, Zap, Eye } from "lucide-react";

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
  const { userId, setBattleId } = useUserContext();
  const navigate = useNavigate();

  // Professional prize calculation display
  const prizePool = battle.amount * 2 - battle.amount * 0.05;
  const isParticipant = userId === battle.player1 || userId === battle.player2;

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
          <div className="px-4 pb-4">
            <button
              onClick={() => {
                setBattleId(battle._id);
                navigate('/battle');
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-900/20"
            >
              <Eye size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Arena</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};