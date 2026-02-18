import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { 
  ArrowLeft, Landmark, User, Hash, ShieldCheck, 
  IndianRupee, AlertCircle, Zap, CreditCard 
} from "lucide-react";
import { toast } from "react-toastify";

export const WithdrawToBank = () => {
  const [token, setToken] = useState(0);
  const [name, setName] = useState("");
  const [IFSC, setIFSCcode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");
  const [balanceLess, setBalanceLess] = useState(false);
  const { userId, amount, phone } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (!name || !accountNumber || !IFSC) {
      return toast.error("Please fill all bank details");
    }
    if (token < 150) {
      return toast.error("Minimum withdrawal is ₹150");
    }

    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/api/auth/withdraw`, {
        userId,
        phoneNumber: phone,
        amount: token,
        wallet: amount - token,
        paymentMethod: 'bank',
        destinationDetails: {
          name,
          IFSC,
          accountNumber,
        }
      });
      
      toast.success("Bank Transfer Requested!");
      navigate('/wallet');
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Transaction Failed");
      setBalanceLess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100 overflow-x-hidden pb-10">
      
      {/* Background Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] right-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />

      {/* Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0b0b0d]/80 backdrop-blur-md border-b border-white/5 max-w-md mx-auto px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/withdraw')} className="p-2 bg-white/5 rounded-xl text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black italic tracking-tight uppercase">Bank Transfer</h1>
      </div>

      <div className="pt-28 px-5 space-y-6">
        
        {/* Balance Snapshot */}
        <div className="bg-[#16161a] border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
              <CreditCard size={18} />
            </div>
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Withdrawable Balance</span>
          </div>
          <span className="text-lg font-black text-white italic">₹{amount}</span>
        </div>

        {/* Bank Details Form */}
        <div className="bg-[#16161a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Landmark size={20} className="text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-widest">Account Details</h3>
            </div>

            {/* Holder Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <User size={12} /> Holder Name
              </label>
              <input 
                type="text" 
                disabled={isLoading} 
                className="w-full bg-[#1f1f25] border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Name as per Bank Record"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <Hash size={12} /> Account Number
              </label>
              <input 
                type="text" 
                disabled={isLoading} 
                className="w-full bg-[#1f1f25] border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Enter Account Number"
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {/* IFSC Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <Zap size={12} /> IFSC Code
              </label>
              <input 
                type="text" 
                disabled={isLoading} 
                className="w-full bg-[#1f1f25] border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500 transition-all uppercase"
                placeholder="SBIN0001234"
                onChange={(e) => setIFSCcode(e.target.value)}
              />
            </div>

            {/* Amount */}
            <div className="space-y-1 pt-4 border-t border-white/5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <IndianRupee size={12} /> Withdrawal Amount
              </label>
              <input 
                type="number" 
                disabled={isLoading} 
                className="w-full bg-[#1f1f25] border border-white/5 rounded-xl p-3 text-xl font-black text-blue-500 outline-none focus:border-blue-500 transition-all"
                placeholder="0"
                onChange={(e) => setToken(parseInt(e.target.value) || 0)}
              />
              <div className="flex justify-between px-1">
                <p className="text-[9px] text-gray-600 font-bold">Min: ₹150</p>
                <p className="text-[9px] text-gray-600 font-bold">Fee: ₹0</p>
              </div>
            </div>

            {/* Action Button */}
            <button 
              disabled={isLoading || !token}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
              onClick={handleWithdraw}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : "Initialize Transfer"}
            </button>
          </div>

          <Landmark className="absolute -right-10 -bottom-10 text-white/5" size={200} />
        </div>

        {/* Important Info */}
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-3">
          <AlertCircle className="text-gray-500 shrink-0 mt-0.5" size={16} />
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            Please ensure that the bank account name matches your KYC name. Payments to 3rd party bank accounts may be rejected.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pt-4">
          <ShieldCheck size={14} className="text-blue-500" /> SECURE END-TO-END PAYOUT
        </div>
      </div>

      {/* Error Modal */}
      {balanceLess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-[#1a1a1f] w-full max-w-xs rounded-[2.5rem] p-8 border border-red-500/20 shadow-2xl text-center">
            <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-black uppercase mb-2">Transaction Error</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-8">{message}</p>
            <button 
              className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest"
              onClick={() => setBalanceLess(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};