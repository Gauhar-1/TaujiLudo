import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { 
   Copy, UploadCloud, ArrowLeft, Zap, ShieldCheck, IndianRupee 
} from "lucide-react";
import { toast } from "react-toastify";

export const DepositPage = () => {
    const [token, setToken] = useState<number>(0);
    const [upiId, setUpiId] = useState<string>('');
    const [QR, setQR] = useState("");
    const [UPI, setUPI] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { userId, amount, phone } = useUserContext();

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/getAdmin`);
                if (response.data) {
                    const { paymentSetting } = response.data.admin[0];
                    setQR(paymentSetting.QR);
                    setUPI(paymentSetting.UPI);
                }
            } catch (err) { console.log(err); }
        };
        fetchPaymentDetails();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(UPI);
        toast.success("UPI ID Copied!");
    };

    const handleDeposit = async () => {
        if (!selectedFile || !token || !upiId) {
            toast.warning("Please fill all details and upload screenshot");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("userId", userId.toString());
        formData.append("amount", token.toString());
        formData.append("wallet", (amount + token).toString());
        formData.append("paymentMethod", 'upi');
        formData.append("upiId", upiId);
        formData.append("phoneNumber", phone);

        try {
            setIsLoading(true);
            await axios.post(`${API_URL}/api/auth/deposit`, formData);
            toast.success("Deposit Request Submitted!");
            navigate("/wallet");
        } catch (err: any) {
            toast.error("Error initiating deposit");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100 overflow-x-hidden pb-20">
            
            {/* Header */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-[#0b0b0d]/80 backdrop-blur-md border-b border-white/5 max-w-md mx-auto px-4 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/wallet')} className="p-2 bg-white/5 rounded-xl text-gray-400">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-black italic tracking-tight uppercase">Add Cash</h1>
            </div>

            <div className="pt-28 px-5 space-y-6">
                
                {/* Step 1: Scan & Pay */}
                <div className="bg-[#16161a] rounded-3xl p-6 border border-white/5 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">1</span>
                        <h3 className="text-xs font-black uppercase tracking-widest">Scan & Pay</h3>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-white p-3 rounded-2xl mb-4 shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                            <img src={`${API_URL}/uploads/${QR}`} alt="QR Code" className="w-44 h-44 object-contain" />
                        </div>
                        
                        <div className="w-full bg-[#1f1f25] rounded-2xl p-3 flex items-center justify-between border border-white/5">
                            <div className="truncate pr-2">
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">UPI ID</p>
                                <p className="text-xs font-mono font-bold text-gray-200 truncate">{UPI}</p>
                            </div>
                            <button onClick={copyToClipboard} className="bg-blue-600/20 text-blue-500 p-2 rounded-lg active:scale-90 transition-all">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 2: Details */}
                <div className="bg-[#16161a] rounded-3xl p-6 border border-white/5 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">2</span>
                        <h3 className="text-xs font-black uppercase tracking-widest">Verify Transaction</h3>
                    </div>

                    <div className="space-y-4">
                        {/* File Upload */}
                        <div className="relative">
                            <input 
                                type="file" 
                                id="screenshot" 
                                className="hidden" 
                                onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                            />
                            <label htmlFor="screenshot" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/5 transition-colors">
                                <UploadCloud className="text-blue-500 mb-2" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                                    {selectedFile ? selectedFile.name : "Upload Payment Screenshot"}
                                </p>
                            </label>
                        </div>

                        {/* UTR Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">UTR / Transaction ID</label>
                            <input 
                                type="text" 
                                placeholder="12-digit UTR Number"
                                className="w-full bg-[#1f1f25] border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500"
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Deposit Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-black">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Enter Amount"
                                    className="w-full bg-[#1f1f25] border border-white/5 rounded-xl p-3 pl-8 text-white font-black text-xl outline-none focus:border-blue-500"
                                    onChange={(e) => setToken(parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <p className="text-[9px] text-gray-600 font-bold ml-1">Min: ₹50 • Max: ₹1,00,000</p>
                        </div>
                    </div>
                </div>

                {/* Tax Breakdown Card */}
                <div className="bg-[#1a1a1f] rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                    <div className="relative z-10 space-y-3">
                        <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                            <span>Amount (Excl. Tax)</span>
                            <span>₹{Math.round(token * 0.72)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold text-red-400">
                            <span>Govt. Tax (28% GST)</span>
                            <span>₹{Math.round(token * 0.28)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold text-green-400">
                            <span>Cashback Bonus</span>
                            <span>₹{Math.round(token * 0.28)}</span>
                        </div>
                        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-white">Total in Wallet</span>
                            <span className="text-lg font-black text-blue-500 italic">₹{token || 0}</span>
                        </div>
                    </div>
                    <Zap className="absolute -right-4 -bottom-4 text-white/5" size={80} />
                </div>

                {/* Action Button */}
                <button 
                    disabled={isLoading}
                    onClick={handleDeposit}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all active:scale-95 shadow-[0_10px_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2"
                >
                    {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "PROCEED DEPOSIT"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pt-4">
                    <ShieldCheck size={14} /> Secured Transaction
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full border-t-2 border-blue-500 animate-spin" />
                        <IndianRupee className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                    </div>
                </div>
            )}
        </div>
    );
};