import axios from "axios";
import { useState } from "react";
import { API_URL } from "../utils/url";
import { 
  QrCode, 
  Smartphone, 
  Upload, 
  Save, 
  ShieldCheck, 
  CheckCircle2
} from "lucide-react";

export const PaymentSettings = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [UPI, setUPI] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a QR image.");
            return;
        }
        setLoading("qr");
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            await axios.post(`${API_URL}/api/auth/QRSettings`, formData);
            alert("QR Code updated successfully!");
        } catch (err) {
            console.error("QR Upload Error:", err);
        } finally {
            setLoading(null);
        }
    };

    const handleUPI = async () => {
        if (!UPI) return console.log("UPI not found");
        setLoading("upi");
        try {
            await axios.post(`${API_URL}/api/auth/UPISettings`, { UPI });
            alert("UPI ID updated!");
        } catch (err) {
            console.error("UPI Update Error:", err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-6 pb-20 font-sans text-gray-100">
            
            {/* HEADER HUD */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white leading-none">
                        Gateway
                    </h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                        Payment Configurations
                    </p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5">
                    <ShieldCheck size={20} className="text-amber-500" />
                </div>
            </div>

            <div className="space-y-6">
                
                {/* 1. QR SETTINGS CARD */}
                <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-white/10">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <QrCode size={18} className="text-amber-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">QR Terminal</h3>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <label htmlFor="fileInput" className="group cursor-pointer block">
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#0b0b0d] group-hover:border-amber-500/40 transition-all">
                                <Upload size={24} className="text-gray-600 group-hover:text-amber-500 mb-2 transition-colors" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">
                                    {selectedFile ? selectedFile.name : "Select QR Image"}
                                </span>
                            </div>
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="hidden" 
                                onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} 
                            />
                        </label>

                        <button 
                            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2
                                ${loading === 'qr' ? 'bg-amber-500/50 cursor-wait' : 'bg-amber-500 text-black hover:bg-amber-400 shadow-xl shadow-amber-500/10'}`}
                            onClick={handleUpload}
                            disabled={loading === 'qr'}
                        >
                            {loading === 'qr' ? "Uploading..." : <><CheckCircle2 size={16}/> Apply QR</>}
                        </button>
                    </div>
                </div>

                {/* 2. UPI SETTINGS CARD */}
                <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-white/10">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <Smartphone size={18} className="text-blue-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">UPI Protocol</h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                Merchant VPA (UPI ID)
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-50">
                                    <Smartphone size={16} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="merchant@upi"
                                    className="w-full bg-[#0b0b0d] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-mono text-white placeholder:text-gray-700 outline-none focus:border-blue-500/50 transition-all"
                                    onChange={(e) => setUPI(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2
                                ${loading === 'upi' ? 'bg-blue-500/50 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/10'}`}
                            onClick={handleUPI}
                            disabled={loading === 'upi'}
                        >
                            {loading === 'upi' ? "Saving..." : <><Save size={16}/> Deploy UPI</>}
                        </button>
                    </div>
                </div>

                {/* SAFETY NOTICE */}
                <div className="mt-8 px-6 text-center opacity-30">
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                        These credentials are visible to all players on the deposit screen. <br/>
                        Double-check before deployment.
                    </p>
                </div>
            </div>
        </div>
    );
};