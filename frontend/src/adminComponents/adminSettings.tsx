import axios from "axios";
import { useState } from "react";
import { API_URL } from "../utils/url";
import { 
  Headset, 
  FileEdit, 
  Save, 
  Smartphone, 
  Info,  
  AlertCircle 
} from "lucide-react";

export const AdminSettings = () => {
    const [content, setContent] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loadingType, setLoadingType] = useState<string | null>(null);

    const handlePhoneNumber = async () => {
        if (!phoneNumber) return console.log("Phone Number is missing");
        setLoadingType("phone");
        try {
            await axios.post(`${API_URL}/api/auth/supportSettings`, { phoneNumber });
            // Add success toast logic here if available
        } catch (err) {
            console.log("Error: " + err);
        } finally {
            setLoadingType(null);
        }
    };

    const handleContent = async () => {
        if (!content) return console.log("Content is missing");
        setLoadingType("content");
        try {
            await axios.post(`${API_URL}/api/auth/infoSettings`, { content });
        } catch (err) {
            console.log("Error: " + err);
        } finally {
            setLoadingType(null);
        }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-6 pb-20 font-sans text-gray-100">
            
            {/* 1. HEADER HUD */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        System Config
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Global Parameters
                    </p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    <Save size={18} className="text-amber-500" />
                </div>
            </div>

            <div className="space-y-6">
                
                {/* 2. SUPPORT SETTINGS MODULE */}
                <div className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-amber-600/5 to-transparent flex items-center gap-3">
                        <Headset size={18} className="text-amber-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">Support Settings</h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                Helpdesk Phone Number
                            </label>
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2
                                ${loadingType === 'phone' ? 'bg-amber-500/50 cursor-wait' : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'}`}
                            onClick={handlePhoneNumber}
                            disabled={loadingType === 'phone'}
                        >
                            {loadingType === 'phone' ? "Processing..." : "Update Terminal"}
                        </button>
                    </div>
                </div>

                {/* 3. INFO SETTINGS MODULE */}
                <div className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent flex items-center gap-3">
                        <FileEdit size={18} className="text-blue-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">Platform Info</h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                Notice Board Content
                            </label>
                            <div className="relative">
                                <textarea
                                    rows={5}
                                    placeholder="Type important platform news or rules here..."
                                    className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div className="absolute bottom-3 right-3 opacity-20">
                                    <Info size={14} />
                                </div>
                            </div>
                        </div>

                        <button 
                            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2
                                ${loadingType === 'content' ? 'bg-blue-500/50 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]'}`}
                            onClick={handleContent}
                            disabled={loadingType === 'content'}
                        >
                            {loadingType === 'content' ? "Updating..." : "Deploy Content"}
                        </button>
                    </div>
                </div>

                {/* 4. SECURITY NOTICE */}
                <div className="flex items-start gap-3 px-4 py-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                    <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-tight">
                        Warning: Changes to support settings and platform information are deployed immediately to all live player terminals. Use caution.
                    </p>
                </div>
            </div>

            {/* Footer Margin */}
            <div className="h-10" />
        </div>
    );
};