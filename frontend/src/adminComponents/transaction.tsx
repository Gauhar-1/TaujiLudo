import { useEffect, useState } from "react";
import { StickyTable } from "../utils/transactionTable";
import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { 
  User, 
  Phone, 
  Mail, 
  History, 
  ShieldCheck, 
  ArrowLeft, 
  Wallet,
  Hash
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransactionHistory = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const { userId, phoneNumber } = useUserContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/findProfile`, { params: { phoneNumber } });
                if (response.data && response.data.length > 0) {
                    const { name, email } = response.data[0];
                    setUserName(name);
                    setEmail(email || "N/A");
                }
            } catch (err) {
                console.error("Error fetching profile: ", err);
            }
        };
        fetchProfile();
    }, [phoneNumber, userId]);

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-4 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER HUD */}
            <div className="flex items-center gap-4 mb-8 px-2">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/5 rounded-2xl text-gray-400 active:scale-90 transition-all border border-white/5"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Statement
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Audit Log
                    </p>
                </div>
            </div>

            {/* 2. PLAYER IDENTITY CARD */}
            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
                <div className="flex gap-5 relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl">
                        <User size={40} className="text-amber-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-2">
                            {username || "Loading..."}
                        </h2>
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
                
                {/* ID Watermark */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Hash size={12} />
                        <span className="text-[9px] font-mono uppercase tracking-tighter italic">
                            UID: {userId?.slice(-12) || "SYSTEM_ERR"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <ShieldCheck size={10} className="text-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified Player</span>
                    </div>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Wallet size={100} />
                </div>
            </div>

            {/* 3. TRANSACTION FEED CONTAINER */}
            <div className="bg-[#16161a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[50vh]">
                
                {/* Branding Header for the Statement */}
                <div className="px-6 py-5 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <History size={18} className="text-blue-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            Activity History
                        </h3>
                    </div>
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter italic">
                        Real-time Data
                    </span>
                </div>

                {/* 4. THE TABLE/LIST */}
                <div className="px-1 pb-10">
                    <StickyTable />
                </div>
            </div>

            {/* Footer Bottom Spacer */}
            <div className="h-10" />
        </div>
    );
};