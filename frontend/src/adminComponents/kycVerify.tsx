import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, User, Mail, Phone, Calendar, 
  MapPin, Hash, Image as ImageIcon, CheckCircle2, 
  XCircle, Send, X, AlertCircle 
} from "lucide-react";

export const KycVerification = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [kycDetails, setKycDetails] = useState<any>({
        Name: "", DOB: "", state: "", documentName: "",
        documentNumber: "", status: "", frontView: "", backView: ""
    });
    const [rejectClicked, setRejectClicked] = useState(false);
    const [frontViewClicked, setFrontViewClicked] = useState(false);
    const [backViewClicked, setBackViewClicked] = useState(false);
    const [reason, setReason] = useState("");

    const { phoneNumber, userId, setUserId } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/findProfile`, { params: { phoneNumber } });
                const { name, email, kycDetails, userId } = response.data[0];
                setKycDetails(kycDetails);
                setUserName(name);
                setEmail(email || "N/A");
                setUserId(userId);
            } catch (err) { console.error("Error fetching profile:", err); }
        };
        fetchProfile();
    }, [phoneNumber, setUserId]);

    const handleAction = async (action: 'verify' | 'reject') => {
        try {
            const endpoint = action === 'verify' ? 'verify-kyc' : 'reject-kyc';
            const payload = action === 'verify' ? { userId } : { userId, reason };
            await axios.post(`${API_URL}/api/auth/${endpoint}`, payload);
            navigate('/admin/pendingKyc');
        } catch (err) { console.error(`Error during ${action}:`, err); }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER HUD */}
            <div className="flex justify-between items-center mb-8 px-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">Verifier</h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                        <ShieldCheck size={10} /> Identity Validation
                    </p>
                </div>
                <div className="flex gap-2">
                    {kycDetails.status === "pending" && (
                        <button 
                            onClick={() => handleAction('verify')}
                            className="bg-emerald-500 text-black p-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"
                        >
                            <CheckCircle2 size={20} />
                        </button>
                    )}
                    <button 
                        onClick={() => setRejectClicked(true)}
                        className="bg-red-500 text-white p-2.5 rounded-xl shadow-lg shadow-red-500/20 active:scale-90 transition-all"
                    >
                        <XCircle size={20} />
                    </button>
                </div>
            </div>

            {/* 2. PLAYER PROFILE CARD */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="flex gap-5 relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl">
                        <User size={40} className="text-amber-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-2">{username}</h2>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Phone size={12} className="text-amber-500/50" />
                                <span className="text-xs font-bold tracking-widest">{phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={12} />
                                <span className="text-[10px] font-medium">{email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <ShieldCheck size={100} />
                </div>
            </div>

            {/* 3. DOCUMENT DETAILS BENTO */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-white/[0.03] border-b border-white/5 flex items-center gap-2">
                    <Hash size={16} className="text-amber-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Document Data</h3>
                </div>

                <div className="p-4 space-y-3">
                    {[
                        { label: 'Document Number', val: kycDetails.documentNumber, icon: <Hash size={14} /> },
                        { label: 'Legal Name', val: kycDetails.Name, icon: <User size={14} /> },
                        { label: 'Date of Birth', val: kycDetails.DOB, icon: <Calendar size={14} /> },
                        { label: 'Residential State', val: kycDetails.state, icon: <MapPin size={14} /> },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3 text-gray-500">
                                {item.icon}
                                <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                            </div>
                            <span className="text-xs font-bold text-white tracking-tight">{item.val}</span>
                        </div>
                    ))}

                    {/* Image Toggles */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {[
                            { label: 'Front View', state: frontViewClicked, setter: setFrontViewClicked, img: kycDetails.frontView },
                            { label: 'Back View', state: backViewClicked, setter: setBackViewClicked, img: kycDetails.backView }
                        ].map((view, i) => (
                            <div key={i} className="space-y-3">
                                <button 
                                    onClick={() => view.setter(!view.state)}
                                    className={`w-full py-3 rounded-2xl border font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
                                    ${view.state ? 'bg-amber-500 border-amber-400 text-black' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                >
                                    <ImageIcon size={14} /> {view.state ? 'Hide' : view.label}
                                </button>
                                {view.state && (
                                    <div className="p-2 bg-[#0b0b0d] rounded-2xl border border-white/10 animate-fade-in">
                                        <img 
                                            src={`${API_URL}/uploads/${view.img}`} 
                                            alt={view.label} 
                                            className="w-full rounded-xl shadow-2xl" 
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. REJECT MODAL */}
            {rejectClicked && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#16161a] border border-white/10 w-full rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => setRejectClicked(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
                        </div>
                        <h2 className="text-xl font-black uppercase italic text-red-500 mb-2 flex items-center gap-2">
                            <AlertCircle size={20} /> Reject KYC
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-6 leading-relaxed">
                            Specify the reason for rejecting {username}'s application.
                        </p>
                        
                        <textarea
                            className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-red-500 transition-all outline-none resize-none mb-6"
                            rows={4}
                            placeholder="e.g. Blurry photo, Name mismatch, Expired document..."
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setRejectClicked(false)} className="py-4 bg-white/5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">Cancel</button>
                            <button 
                                onClick={() => handleAction('reject')}
                                className="py-4 bg-red-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
                            >
                                <Send size={14} /> Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}