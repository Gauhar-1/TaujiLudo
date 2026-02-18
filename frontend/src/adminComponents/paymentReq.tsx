import { useEffect, useState } from "react";
import { API_URL } from "../utils/url";
import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import {  
  User, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  XCircle,
  ArrowLeft,
  Banknote,
  Smartphone,
  Send,
  X,
  Image as ImageIcon
} from "lucide-react";

export const PaymentRequest = () => {
    const { paymentId, setId, id } = useUserContext();
    const [battle, setBattle] = useState<any>(null);
    const [rejectClicked, setRejectClicked] = useState(false);
    const [viewClicked, setViewClicked] = useState(false);
    const [reason, setReason] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/findTransaction`, { params: { paymentId } });
                setBattle(response.data);
                setId(response.data.userId);
            } catch (err) { console.error("Error:", err); }
        };
        fetchTransaction();
    }, [paymentId, setId]);

    const handleVerdict = async (action: 'verify' | 'reject') => {
        try {
            const sanitizedId = battle._id.toString().replace(/:/g, "");
            const endpoint = action === 'verify' ? 'verify-payment' : 'reject-payment';
            const payload = action === 'verify' 
                ? { transactionId: sanitizedId, userId: id } 
                : { transactionId: sanitizedId, reason, userId: id };

            await axios.post(`${API_URL}/api/auth/${endpoint}`, payload);
            navigate('/admin/reqPayments');
        } catch (err) { console.error("Verdict Error:", err); }
    };

    if (!battle) return <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center text-amber-500 font-black animate-pulse">Loading Transaction...</div>;

    const isDeposit = battle.type === "deposit";
    const date = new Date(battle.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER HUD */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-gray-400 active:scale-90 transition-all border border-white/5">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">Authorization</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isDeposit ? 'text-blue-500' : 'text-rose-500'}`}>
                        {battle.type} request
                    </p>
                </div>
            </div>

            {/* 2. TRANSACTION SUMMARY CARD */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${isDeposit ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                            <IndianRupee size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Amount</p>
                            <h2 className="text-2xl font-black text-white italic leading-none">₹{battle.amount}</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Status</span>
                        <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 text-[8px] font-black uppercase tracking-widest">Pending</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1"><User size={10}/> User ID</p>
                        <p className="text-xs font-mono font-bold text-gray-300">#{battle.userId.slice(-10)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center justify-end gap-1"><Calendar size={10}/> Date</p>
                        <p className="text-xs font-bold text-gray-300">{date.split(',')[0]}</p>
                    </div>
                </div>
            </div>

            {/* 3. SETTLEMENT DETAILS BENTO */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl mb-6">
                <div className="px-6 py-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {battle.paymentMethod === 'bank' ? <Banknote size={16} className="text-amber-500" /> : <Smartphone size={16} className="text-amber-500" />}
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            {battle.paymentMethod === 'bank' ? 'Bank Settlement' : 'UPI Transfer'}
                        </h3>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {typeof battle.details === "string" ? (
                        <div className="space-y-2">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Reference / UTR No.</p>
                            <div className="p-4 bg-[#0b0b0d] rounded-2xl border border-white/5 text-center">
                                <span className="text-sm font-mono font-black text-amber-500 tracking-widest uppercase">{battle.details}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: 'Account Holder', val: battle.details.name },
                                { label: 'IFSC Code', val: battle.details.IFSC },
                                { label: 'Account Number', val: battle.details.accountNumber },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                    <span className="text-[9px] font-black text-gray-600 uppercase">{item.label}</span>
                                    <span className="text-xs font-mono font-black text-gray-300">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {isDeposit && (
                        <button 
                            onClick={() => setViewClicked(!viewClicked)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                        >
                            <ImageIcon size={14} /> {viewClicked ? "Hide Proof" : "View Receipt"}
                        </button>
                    )}
                </div>

                {viewClicked && isDeposit && (
                    <div className="p-4 bg-[#0b0b0d] animate-fade-in">
                        <img src={`${API_URL}/uploads/${battle.filename}`} alt="Proof" className="w-full rounded-2xl shadow-2xl border border-white/10" />
                    </div>
                )}
            </div>

            {/* 4. ACTIONS */}
            {!rejectClicked ? (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleVerdict('verify')}
                        className="py-4 bg-emerald-500 rounded-3xl font-black uppercase text-xs tracking-widest text-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 active:scale-95 transition-all"
                    >
                        <CheckCircle2 size={18} /> Approve
                    </button>
                    <button 
                        onClick={() => setRejectClicked(true)}
                        className="py-4 bg-[#16161a] border border-red-500/30 text-red-500 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <XCircle size={18} /> Reject
                    </button>
                </div>
            ) : (
                <div className="bg-[#16161a] border border-red-500/30 rounded-[2.5rem] p-6 animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-red-500 uppercase italic">Rejection Reason</h3>
                        <button onClick={() => setRejectClicked(false)}><X size={16} className="text-gray-600"/></button>
                    </div>
                    <textarea
                        className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-500 outline-none resize-none mb-4"
                        rows={3}
                        placeholder="e.g. Invalid UTR number, Amount mismatch..."
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setRejectClicked(false)} className="py-3 bg-white/5 rounded-xl font-black uppercase text-[10px] text-gray-400">Cancel</button>
                        <button onClick={() => handleVerdict('reject')} className="py-3 bg-red-600 rounded-xl font-black uppercase text-[10px] text-white flex items-center justify-center gap-2">
                            <Send size={14}/> Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};