import { ArrowLeft, ShieldAlert, Video, Clock, AlertTriangle, Scale, Info, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RulesPgage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto relative font-sans text-gray-100  pb-20">
            
            {/* Header */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-[#0b0b0d]/80 backdrop-blur-md border-b border-white/5 max-w-md mx-auto px-6 py-5 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl text-gray-400">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic tracking-tight uppercase">Ludo Rules</h1>
            </div>

            <div className="pt-32 px-5 space-y-6 overflow-y-auto">
                
                {/* Critical Alert Card */}
                <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 flex gap-3">
                    <Video className="text-red-500 shrink-0" size={20} />
                    <p className="text-[11px] font-bold text-red-200 leading-relaxed">
                        कैंसिल प्रूफ करने के लिए वीडियो रिकॉर्डिंग आवश्यक होगी। बिना वीडियो प्रूफ के एडमिन का निर्णय अंतिम माना जायेगा।
                    </p>
                </div>

                {/* Rules Sections */}
                <div className="space-y-4">
                    
                    {/* Category: Gameplay */}
                    <div className="bg-[#16161a] rounded-3xl p-6 border border-white/5 shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                            <Scale size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Match Conduct</h3>
                        </div>
                        
                        <div className="space-y-4 text-[11px] text-gray-400 leading-relaxed font-medium">
                            <p><span className="text-white font-bold">1.</span> यदि आप जान भुजकर Autoexit करते है तो भी आपको 100% Loss कर दिया जायेगा। यदि दोनों प्लेयर की गोटी नहीं खुली तो गेम कैंसिल हो सकता है।</p>
                            <p><span className="text-white font-bold">2.</span> यदि 1 टोकन बाहर है और घर के पास है तो 30% Loss दिया जायेगा। यदि 2 गोटी बाहर है और आप लेफ्ट करते है तो 100% Loss होगा।</p>
                            <p><span className="text-white font-bold">3.</span> 'कैंसिल' रिजल्ट डालने के बाद गेम प्ले न करें। यदि आप जीत भी जाते है तो गेम कैंसिल ही माना जायेगा।</p>
                        </div>
                    </div>

                    {/* Category: Reporting */}
                    <div className="bg-[#16161a] rounded-3xl p-6 border border-white/5 shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <Clock size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Reporting & Timeline</h3>
                        </div>
                        
                        <div className="space-y-4 text-[11px] text-gray-400 leading-relaxed font-medium">
                            <p><span className="text-white font-bold">4.</span> गेम समाप्त होने के <span className="text-blue-400">15 मिनट</span> के अंदर रिजल्ट डालना अनिवार्य है, अन्यथा अपोनेंट के आधार पर अपडेट कर दिया जायेगा।</p>
                            <p><span className="text-white font-bold">5.</span> एक बार रिजल्ट डालने के बाद बदला नहीं जा सकता। गलत रिजल्ट डालने पर पेनल्टी लगाई जाएगी।</p>
                        </div>
                    </div>

                    {/* Category: Disputes */}
                    <div className="bg-[#16161a] rounded-3xl p-6 border border-white/5 shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-yellow-500">
                            <ShieldAlert size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Dispute Resolution</h3>
                        </div>
                        
                        <div className="space-y-4 text-[11px] text-gray-400 leading-relaxed font-medium">
                            <p><span className="text-white font-bold">6.</span> स्क्रीनशॉट लेना भूल गए हैं तो रिजल्ट डालने से पहले <span className="text-yellow-500">Live Chat</span> में एडमिन से संपर्क करें।</p>
                            <p><span className="text-white font-bold">7.</span> Fresh ID के मामले में पासा के उपयोग का वीडियो प्रमाण जरूरी है। 'नो फ्रेश' आईडी टेबल को सोच समझकर जॉइन करें।</p>
                        </div>
                    </div>

                </div>

                {/* Commission Note */}
                <div className="bg-[#1a1a1f] rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
                                <Zap size={20} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest">Commission Rates</h4>
                        </div>
                        <span className="text-lg font-black text-emerald-500 italic">5% Flat</span>
                    </div>
                </div>

                {/* Footer Security Note */}
                <div className="flex flex-col items-center gap-2 opacity-30 pt-4">
                    <AlertTriangle size={24} />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">Fair Play Policy</p>
                </div>
            </div>

            {/* Floating Brand Watermark */}
            <div className="absolute -bottom-10 -left-10 opacity-5 select-none pointer-events-none">
                <Info size={300} />
            </div>
        </div>
    );
};