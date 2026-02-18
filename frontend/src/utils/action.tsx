import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import axios from "axios";
import { API_URL } from "./url";
import { 
  History, 
  Eye, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  Gavel, 
  PlusCircle,
  ExternalLink
} from "lucide-react";

/* --- 1. TRANSACTION HISTORY BUTTON --- */
export const Transaction = (props: any) => {
  const navigate = useNavigate();
  const { setId, setPhoneNumber } = useUserContext();

  return (
    <button 
      className="flex items-center justify-center bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500/20 rounded-xl p-2.5 transition-all active:scale-90"
      onClick={() => {
        setId(props.userId);
        setPhoneNumber(props.phoneNumber);
        navigate('transaction');
      }}
    >
      <History size={18} strokeWidth={2.5} />
    </button>
  );
};

/* --- 2. KYC VIEW BUTTON --- */
export const KycView = (props: any) => {
  const navigate = useNavigate();
  const { setPhoneNumber } = useUserContext();

  return (
    <button 
      className="flex items-center gap-2 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
      onClick={() => {
        setPhoneNumber(props.phoneNumber);
        navigate('/admin/pendingKyc/kycView');
      }}
    >
      <Eye size={14} /> View KYC
    </button>
  );
};

/* --- 3. QUICK ACCEPT/CHECK BUTTON --- */
export const Accept = () => {
  return (
    <button className="flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 border border-emerald-500/20 rounded-xl p-2.5 transition-all active:scale-90">
      <CheckCircle2 size={18} strokeWidth={2.5} />
    </button>
  );
};

/* --- 4. BLOCK PLAYER (ICON) --- */
export const Blockplayer = (props: any) => {
  const blockPlayer = async () => {
    if (!props.userId) return;
    try {
      await axios.post(`${API_URL}/api/auth/blockPlayer`, { userId: props.userId });
    } catch (err) { console.log(err); }
  };

  return (
    <button 
      className="flex items-center justify-center bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 rounded-xl p-2.5 transition-all active:scale-90 shadow-lg shadow-red-900/10"
      onClick={blockPlayer}
    >
      <ShieldAlert size={18} strokeWidth={2.5} />
    </button>
  );
};

/* --- 5. UNBLOCK PLAYER (TEXT) --- */
export const UnBlock = (props: any) => {
  const handleUnBlock = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/unblockPlayer`, { userId: props.userId });
    } catch (err) { console.log(err); }
  };

  return (
    <button 
      className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black uppercase text-[10px] tracking-widest py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
      onClick={handleUnBlock}
    >
      <ShieldCheck size={14} /> Restore Player
    </button>
  );
};

/* --- 6. DELETE BATTLE BUTTON --- */
export const DeleteBattle = (props: any) => {
  const handleDelete = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/deleteBattle`, { battleId: props.battleId });
    } catch (err) { console.log(err); }
  };

  return (
    <button 
      className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-[10px] tracking-widest py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
      onClick={handleDelete}
    >
      <Trash2 size={14} /> Terminate
    </button>
  );
};

/* --- 7. VIEW RESULT/DISPUTE/PAYMENT BUTTONS (Grouped Logic) --- */
const GenericViewButton = ({ id, path, label, icon, contextSetter }: { id: any; path: string; label: string; icon: any; contextSetter: keyof ReturnType<typeof useUserContext> }) => {
  const navigate = useNavigate();
  const context = useUserContext();

  return (
    <button 
      className="w-full flex items-center justify-center gap-2 bg-[#1f1f25] text-white border border-white/5 font-black uppercase text-[10px] tracking-widest py-3 rounded-xl hover:border-amber-500/50 transition-all active:scale-95 group"
      onClick={() => {
        (context[contextSetter] as any)(id);
        navigate(path);
      }}
    >
      <div className="group-hover:text-amber-500 transition-colors">{icon}</div>
      {label}
    </button>
  );
};

export const ViewResult = (props: any) => (
  <GenericViewButton id={props.battleId} path="/admin/viewResult" label="Details" icon={<Eye size={14} />} contextSetter="setBattleId" />
);

export const DisputeResult = (props: any) => (
  <GenericViewButton id={props.battleId} path="/admin/disputeResult" label="Investigate" icon={<Gavel size={14} />} contextSetter="setBattleId" />
);

export const PaymentReq = (props: any) => (
  <GenericViewButton id={props.battleId} path="/admin/paymentReq" label="Process" icon={<ExternalLink size={14} />} contextSetter="setPaymentId" />
);

/* --- 8. ADD MONEY BUTTON --- */
export const AddMoney = (props: any) => {
  const navigate = useNavigate();
  const profile = props.profile;

  return (
    <button 
      className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
      onClick={() => navigate('/admin/addMoney', { state: { profile } })}
    >
      <PlusCircle size={14} /> Add Capital
    </button>
  );
};