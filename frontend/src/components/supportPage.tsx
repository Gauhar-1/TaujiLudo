import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/url";
import { MessageCircle, Phone, Clock, ShieldCheck, ArrowLeft, Zap, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SupportPage = () => {
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleInfoBar = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/getAdmin`);
                if (response.data) {
                    const { adminSetting } = response.data.admin[0];
                    setPhone(adminSetting.phoneNumber);
                }
            } catch (err) {
                console.log("Error: " + err);
            }
        };
        handleInfoBar();
    }, []);

    const openWhatsapp = async () => {
        try {
            setIsLoading(true);
            const message = encodeURIComponent("Hello TaujiLudo Team, I need assistance with my account.");
            window.open(`https://wa.me/91${phone}?text=${message}`, "_blank");
        } catch (err: any) {
            console.log("Error: " + err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100 overflow-hidden flex flex-col">
            
            {/* Background Gradient Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-64 h-64 bg-green-600/10 rounded-full blur-[100px]" />

            {/* Header */}
            <div className="relative z-10 px-6 pt-12 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic tracking-tight uppercase">Support Center</h1>
            </div>

            <div className="relative z-10 px-6 py-8 flex-1 flex flex-col">
                {/* Hero Illustration Replacement */}
                <div className="bg-gradient-to-b from-[#1a1a1f] to-transparent rounded-[2.5rem] p-8 border border-white/5 mb-8 text-center">
                    <div className="bg-blue-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <ShieldCheck size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2 tracking-tight">How can we help?</h2>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed px-4">
                        Our support team is active 24/7 to resolve your queries regarding payments, battles, or technical issues.
                    </p>
                </div>

                {/* Support Options */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 bg-[#16161a] p-4 rounded-2xl border border-white/5">
                        <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-white">Average Response Time</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Under 5 Minutes</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#16161a] p-4 rounded-2xl border border-white/5">
                        <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-500">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-white">Direct Support</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Withdrawal & Deposit Help</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                    <button 
                        onClick={openWhatsapp}
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_20px_rgba(37,211,102,0.2)]"
                    >
                        <MessageCircle size={22} fill="currentColor" />
                        CONTACT ON WHATSAPP
                    </button>

                    <div className="bg-[#1a1a1f] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-800 p-2 rounded-lg text-gray-400">
                                <Phone size={18} />
                            </div>
                            <span className="text-sm font-bold tracking-wider text-gray-200">+91 {phone}</span>
                        </div>
                        <button 
                            className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1"
                            onClick={() => window.location.href = `tel:+91${phone}`}
                        >
                            Call <ExternalLink size={12} />
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-8 mb-4">
                    Taujiludo Official Support
                </p>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full border-t-2 border-green-500 animate-spin" />
                        <MessageCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500" />
                    </div>
                </div>
            )}
        </div>
    );
};