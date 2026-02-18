import { useEffect, useState } from "react";
import { API_URL } from "../utils/url";
import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Frown, 
  ShieldCheck,
  XCircle, 
  CheckCircle2, 
  ArrowLeft, 
  IndianRupee,
  MessageSquare,
  X,
  Activity
} from "lucide-react";

export const BattleResult = () => {
  const { battleId, id, setId, setBattleId } = useUserContext();
  const [battle, setBattle] = useState<any>(null); // Initialized as null for better loading state
  const [rejectClicked, setRejectClicked] = useState(false);
  const [viewClicked, setViewClicked] = useState(false);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/battles/inBattle`, { params: { battleId } });
        setBattle(response.data);
      } catch (err) { console.error(err); }
    };
    fetchBattle();
  }, [battleId]);

  const handleVerify = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/battles/disputeBattle/approve`, { battleId, userId: id });
      navigate('/admin/completeBattle');
    } catch (err) { console.error(err); }
  };

  const handleReject = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/battles/disputeBattle/reject`, { userId: id, reason, battleId });
      navigate('/admin/completeBattle');
    } catch (err) { console.error(err); }
  };

  const checkPlayer = (clicked: string) => {
    if (!battle?.dispute?.proofs?.length) return "N/A";
    if (clicked === "image") {
      return battle.dispute.proofs.find((p: any) => p.clicked === "Won")?.filename || null;
    }
    if (clicked === "Reject") {
      return battle.dispute.proofs.find((p: any) => p.clicked === "Won")?.player || null;
    }
    const proof = battle.dispute.proofs.find((p: any) => p.clicked === clicked);
    return proof ? (proof.player === battle.player1 ? battle.player1Name : battle.player2Name) : "Unclaimed";
  };

  if (!battle) return <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center text-amber-500 font-black animate-pulse">Fetching Evidence...</div>;

  const isApproved = battle.winner === "decided";

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
      
      {/* 1. HEADER HUD */}
      <div className="flex items-center gap-4 mb-8 px-2">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-gray-400 border border-white/5 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">Verdict</h1>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">Battle Resolution</p>
        </div>
      </div>

      {/* 2. CASE SUMMARY CARD */}
      <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-start mb-6">
          <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2
            ${isApproved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'}`}>
            {isApproved ? <ShieldCheck size={12}/> : <Activity size={12}/>}
            {isApproved ? "Approved" : "Review Pending"}
          </div>
          <span className="text-[9px] font-mono text-gray-600">ID: {battleId.slice(-10)}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-center">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Pot Amount</p>
            <div className="flex items-center justify-center text-white font-black italic">
               <IndianRupee size={14} /> <span>{battle.amount}</span>
            </div>
          </div>
          <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-center">
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Winner Prize</p>
            <div className="flex items-center justify-center text-emerald-500 font-black italic">
               <IndianRupee size={14} /> <span>{Math.floor((2*battle.amount) -(battle.amount * 0.05))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTENDER ROLES */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between bg-emerald-500/10 p-5 rounded-3xl border border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 text-black p-2 rounded-xl"><Trophy size={18}/></div>
            <div>
              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Claimed Winner</p>
              <h4 className="text-sm font-black text-white">{checkPlayer("Won")}</h4>
            </div>
          </div>
          {!isApproved && (
            <button onClick={() => setViewClicked(true)} className="text-emerald-500 bg-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                Evidence
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 bg-white/[0.03] p-5 rounded-3xl border border-white/5 opacity-60">
            <div className="bg-gray-700 text-gray-400 p-2 rounded-xl"><Frown size={18}/></div>
            <div>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Claimed Loser</p>
                <h4 className="text-sm font-black text-gray-400">{checkPlayer("Lost")}</h4>
            </div>
        </div>
      </div>

      {/* 4. ACTIONS */}
      {!isApproved && !rejectClicked && (
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setId(checkPlayer("Reject")); setBattleId(battle._id); handleVerify(); }}
            className="py-5 bg-emerald-500 text-black rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18}/> Confirm
          </button>
          <button 
            onClick={() => { setId(checkPlayer("Reject")); setRejectClicked(true); }}
            className="py-5 bg-red-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={18}/> Reject
          </button>
        </div>
      )}

      {/* 5. MODALS */}
      {viewClicked && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
          <button onClick={() => setViewClicked(false)} className="absolute top-10 right-10 text-white bg-white/10 p-3 rounded-full"><X/></button>
          <div className="relative group">
            <img src={`${API_URL}/uploads/${checkPlayer("image")}`} alt="Evidence" className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-white/10" />
            <div className="absolute -bottom-10 left-0 right-0 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Evidence Screenshot</div>
          </div>
        </div>
      )}

      {rejectClicked && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-xl animate-slide-up">
            <div className="bg-[#16161a] border border-white/10 rounded-[2.5rem] w-full p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black italic uppercase text-red-500">Decline Claim</h2>
                    <button onClick={() => setRejectClicked(false)} className="text-gray-600"><X/></button>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Send feedback to {checkPlayer("Won")}</p>
                <textarea
                    className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-red-500 transition-all mb-6 resize-none"
                    rows={4}
                    placeholder="State the reason for rejection..."
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setRejectClicked(false)} className="py-4 bg-white/5 rounded-2xl font-black uppercase text-[10px] text-gray-500">Cancel</button>
                    <button onClick={() => handleReject()} className="py-4 bg-red-600 rounded-2xl font-black uppercase text-[10px] text-white flex items-center justify-center gap-2">
                        <MessageSquare size={14}/> Send Verdict
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="h-10" />
    </div>
  );
};