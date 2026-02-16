import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Headset, Star, Zap, Users, Wallet } from "lucide-react";

export const WinCashPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0b0b0d]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-2 border-b-2 border-red-500 animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-gray-100 w-full max-w-md mx-auto pb-24 shadow-2xl overflow-x-hidden">
      
      {/* Header Banner */}
      <div className="relative pt-12 px-4 mb-6">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-5 rounded-2xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-lg font-black tracking-tight leading-tight mb-1">
              Taujiludo पर आपका स्वागत है
            </h2>
            <p className="text-[11px] font-bold text-red-100 opacity-90 mb-3 flex items-center gap-1">
              <Wallet size={12} /> विड्रॉल केवल 5 से 10 मिनट में • 24/7 Support
            </p>
            <div className="flex gap-4 border-t border-white/20 pt-3">
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-70 font-bold">Commission</p>
                <p className="font-black text-sm">5%</p>
              </div>
              <div className="w-[1px] bg-white/20 h-8" />
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-70 font-bold">Referral</p>
                <p className="font-black text-sm">2%</p>
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
      </div>

      {/* Game Selection Grid */}
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" /> Choose Your Arena
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <Users size={12} /> 1,240 Online
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Game Card 1 */}
          <div 
            onClick={() => navigate('/home')}
            className="group relative cursor-pointer active:scale-95 transition-all"
          >
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-red-500/30">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-white">LIVE NOW</span>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl border border-white/5 group-hover:border-red-500/50 transition-colors">
              <img 
                src="/ludo1.jpg" 
                alt="Ludo Classic" 
                className="w-full h-56 object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-white drop-shadow-md">Ludo Classic</p>
                <button className="mt-2 w-full bg-red-600 py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 shadow-lg">
                  PLAY <Play size={10} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* Game Card 2 */}
          <div className="group relative cursor-not-allowed opacity-80 transition-all">
             <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-2xl">
                <span className="bg-gray-800 text-[9px] font-black px-3 py-1 rounded-full border border-white/10 italic">COMING SOON</span>
             </div>
            
            <div className="relative overflow-hidden rounded-2xl border border-white/5">
              <img 
                src="/ludo2.jpg" 
                alt="Ludo Rush" 
                className="w-full h-56 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-white/50">Ludo Rush</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Card - Wide Layout */}
        <div 
          onClick={() => navigate('/support')}
          className="relative group cursor-pointer active:scale-[0.98] transition-all pt-4"
        >
          <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/40 transition-all shadow-xl">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img src="/ludo6.jpg" alt="Support" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay" />
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Headset size={18} className="text-blue-400" />
                    <h4 className="font-black text-sm uppercase tracking-tight">Need Help?</h4>
                </div>
                <p className="text-[11px] text-gray-400 font-medium leading-tight">Our team is available 24/7 to assist with your deposits & withdrawals.</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-blue-400 group-hover:translate-x-1 transition-transform">
                    CONTACT SUPPORT <ArrowRight size={12} />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Placeholder */}
      <div className="mt-12 text-center opacity-20 select-none">
        <h1 className="text-4xl font-black italic tracking-tighter">TAUJILUDO</h1>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Play with Pride</p>
      </div>
    </div>
  );
};

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);