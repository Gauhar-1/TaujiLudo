import { useEffect, useState } from "react";
import { API_URL } from "../utils/url";
import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { socket } from "../components/homePage";
import { useNavigate } from "react-router-dom";
import { 
  Gavel, Trash2, User, Phone, XCircle, CheckCircle2, 
  AlertTriangle, Send, X, Image as ImageIcon
} from "lucide-react";

export const DisputeResult = () => {
  const { battleId, } = useUserContext();
  const [battle, setBattle] = useState<any>(null);
  const [activeReject, setActiveReject] = useState<number | null>(null); // 1 or 2
  const [reason, setReason] = useState("");
  const [fullScreenImg, setFullScreenImg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/battles/inBattle`, { params: { battleId } });
        setBattle(response.data);
      } catch (err) { console.error(err); }
    };
    fetchBattle();
    const interval = setInterval(fetchBattle, 5000);
    return () => clearInterval(interval);
  }, [battleId]);

  const handleVerify = async (playerId: string) => {
    try {
      await axios.post(`${API_URL}/api/auth/battles/disputeBattle/approve`, { battleId, userId: playerId });
      navigate('/admin/disputeBattle');
    } catch (err) { console.error(err); }
  };

  const handleReject = async (playerId: string) => {
    try {
      await axios.post(`${API_URL}/api/auth/battles/disputeBattle/reject`, { userId: playerId, reason, battleId });
      setActiveReject(null);
    } catch (err) { console.error(err); }
  };

  const checkProof = (playerNum: number, field: 'clicked' | 'image') => {
    const targetPlayerId = playerNum === 1 ? battle?.player1 : battle?.player2;
    const proof = battle?.dispute?.proofs?.find((p: any) => p.player === targetPlayerId);
    return field === 'clicked' ? proof?.clicked || "No claim" : proof?.filename;
  };

  if (!battle) return <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center text-amber-500 font-black uppercase tracking-widest animate-pulse">Loading Case...</div>;

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
      
      {/* 1. INVESTIGATION HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">Investigator</h1>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
            <AlertTriangle size={10} /> Active Dispute Case
          </p>
        </div>
        <button 
          onClick={() => { socket.emit("deleteBattle", battle._id); navigate('/admin/disputeBattle'); }}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl border border-red-500/20 transition-all active:scale-90"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* 2. BATTLE SUMMARY CARD */}
      <div className="bg-[#16161a] border border-white/5 rounded-[2rem] p-5 mb-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Case Details</span>
            <span className="text-[9px] font-mono text-amber-500/50 italic">BID: {battleId?.slice(-12).toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] p-3 rounded-2xl">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Entry Fee</p>
                <p className="text-lg font-black text-white italic">₹{battle.amount}</p>
            </div>
            <div className="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10 text-right">
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Contested Prize</p>
                <p className="text-lg font-black text-emerald-500 italic">₹{Math.floor((2*battle.amount) -(battle.amount * 0.05))}</p>
            </div>
        </div>
      </div>

      {/* 3. CONTENDER COMPARISON */}
      <div className="space-y-6">
        {[1, 2].map((num) => (
          <div key={num} className={`bg-[#16161a] border ${battle.dispute.winner === (num === 1 ? battle.player1 : battle.player2) ? 'border-emerald-500/50' : 'border-white/5'} rounded-[2.5rem] overflow-hidden shadow-2xl relative`}>
            
            {/* Contender Header */}
            <div className="p-5 flex justify-between items-start bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-tight">{num === 1 ? battle.player1Name : battle.player2Name}</h3>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Phone size={10} />
                    <span className="text-[10px] font-bold">{num === 1 ? battle.dispute.players[0] : battle.dispute.players[1]}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Claimed</p>
                <span className={`text-[10px] font-black uppercase italic ${checkProof(num, 'clicked') === 'Won' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {checkProof(num, 'clicked')}
                </span>
              </div>
            </div>

            {/* Evidence & Actions */}
            <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between gap-4">
              {checkProof(num, 'image') ? (
                <button 
                   onClick={() => setFullScreenImg(checkProof(num, 'image'))}
                   className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95"
                >
                  <ImageIcon size={14} /> Evidence
                </button>
              ) : <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">No Screenshot</span>}

              <div className="flex gap-2">
                <button 
                    onClick={() => handleVerify(num === 1 ? battle.player1 : battle.player2)}
                    className="h-10 w-10 bg-emerald-500 text-black rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all active:scale-90 shadow-lg shadow-emerald-900/20"
                >
                  <CheckCircle2 size={20} />
                </button>
                <button 
                    onClick={() => setActiveReject(num)}
                    className="h-10 w-10 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            
            {/* Status Overlay if winner exists */}
            {battle.dispute.winner && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className={`px-6 py-2 rounded-full font-black uppercase italic tracking-[0.2em] border-2 shadow-2xl ${battle.dispute.winner === (num === 1 ? battle.player1 : battle.player2) ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-red-600 text-white border-red-500 opacity-50'}`}>
                        {battle.dispute.winner === (num === 1 ? battle.player1 : battle.player2) ? 'Winner' : 'Loser'}
                    </span>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. REJECT MODAL (Overlay) */}
      {activeReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#16161a] border border-white/10 w-full rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setActiveReject(null)} className="text-gray-500 hover:text-white"><X size={24}/></button>
            </div>
            <h2 className="text-xl font-black uppercase italic text-red-500 mb-2 flex items-center gap-2">
                <Gavel size={20} /> Reject Claim
            </h2>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-6">
                Send feedback to {activeReject === 1 ? battle.player1Name : battle.player2Name}
            </p>
            
            <textarea
                className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-500 transition-all outline-none resize-none mb-6"
                rows={4}
                placeholder="Explain the reason for rejection (e.g. Invalid screenshot, suspicious activity)..."
                onChange={(e) => setReason(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveReject(null)} className="py-4 bg-white/5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">Cancel</button>
                <button 
                    onClick={() => handleReject(activeReject === 1 ? battle.player1 : battle.player2)}
                    className="py-4 bg-red-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
                >
                    <Send size={14} /> Send Verdict
                </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. IMAGE MODAL (Full Screen) */}
      {fullScreenImg && (
          <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-zoom-in">
              <button onClick={() => setFullScreenImg(null)} className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white"><X /></button>
              <img src={`${API_URL}/uploads/${fullScreenImg}`} alt="Evidence" className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10 shadow-emerald-500/10" />
          </div>
      )}

      <div className="h-10" />
    </div>
  );
};