import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { 
  Users,  Share2, Copy, TrendingUp, 
   Award, Zap, ArrowLeft 
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ReferPage = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [referalLink, setReferalLink] = useState("");
  const [referals, setReferals] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const { phone } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleReferal = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/findProfile`, { params: { phoneNumber: phone } });
        if (response.data) {
          const { referalLink, referrals, totalUserReferalEarning } = response.data[0];
          setReferalLink(referalLink);
          setReferals(referrals.length);
          setEarnings(totalUserReferalEarning);
        }
      } catch (err) {
        console.error("Referral Fetch Error:", err);
      }
    };
    if (phone) handleReferal();
  }, [phone]);

  const copyToClipboard = () => {
    if (referalLink) {
      navigator.clipboard.writeText(referalLink)
        .then(() => toast.success("Referral Link Copied!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto text-gray-100 font-sans pb-24 relative overflow-x-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[20%] right-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0b0b0d]/80 backdrop-blur-md border-b border-white/5 px-6 pt-12 pb-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl text-gray-400">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tight uppercase leading-none text-white">Partner Program</h1>
            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mt-1">Invite & Earn Lifetime</p>
          </div>
      </div>

      <div className="px-5 pt-6 space-y-6 relative z-10">
        
        {/* Hero Illustration Replacement */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white leading-tight mb-2 uppercase tracking-tighter">
              Earn 2% Commission <br /> <span className="text-purple-200">On Every Win</span>
            </h2>
            <p className="text-xs text-purple-100 opacity-80 font-medium max-w-[200px] mb-6">
              Invite your friends to the arena and get rewarded for every game they win, forever.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div className="truncate pr-4">
                    <p className="text-[8px] font-black text-purple-200 uppercase tracking-widest mb-1">Your Unique Link</p>
                    <p className="text-xs font-mono font-bold text-white truncate" ref={divRef}>{referalLink || "LudoArena.com/ref/..."}</p>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="bg-white text-purple-600 p-2.5 rounded-xl shadow-lg active:scale-90 transition-all shrink-0"
                >
                  <Copy size={18} />
                </button>
            </div>
          </div>
          {/* Large Abstract Icon */}
          <Share2 className="absolute -right-10 -bottom-10 text-white/10" size={200} />
        </div>

        {/* Bento Metrics Card */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#16161a] border border-white/5 rounded-3xl p-5 shadow-xl">
            <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
              <Users size={20} />
            </div>
            <p className="text-2xl font-black italic text-white leading-none mb-1">{referals}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Friends</p>
          </div>

          <div className="bg-[#16161a] border border-white/5 rounded-3xl p-5 shadow-xl">
            <div className="bg-emerald-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
              <TrendingUp size={20} />
            </div>
            <p className="text-2xl font-black italic text-emerald-500 leading-none mb-1">₹{earnings}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Earned Total</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-[#16161a] rounded-[2rem] p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Award size={18} className="text-yellow-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">How it works</h3>
          </div>

          <div className="space-y-6">
            <Step 
              num="1" 
              title="Share the Link" 
              desc="Copy your unique link and share it with your friends on WhatsApp or Telegram." 
            />
            <Step 
              num="2" 
              title="They Join & Win" 
              desc="When your friends register and win a battle, you earn a percentage of their prize." 
            />
            <Step 
              num="3" 
              title="Instant Rewards" 
              desc="Referral bonuses are credited directly to your wallet instantly." 
            />
          </div>
        </div>

        {/* Commission Note */}
        <div className="bg-purple-600/5 border border-purple-500/10 rounded-2xl p-4 flex items-center gap-4">
          <Zap size={20} className="text-purple-500 shrink-0" />
          <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
            Example: If your friend wins a battle of ₹10,000, you get ₹200 credited to your wallet immediately. There is no limit on earnings!
          </p>
        </div>

      </div>

      {/* Floating Call to Action */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full px-10 max-w-md pointer-events-none">
          <button 
            onClick={copyToClipboard}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all pointer-events-auto flex items-center justify-center gap-2"
          >
            Invite Friends <Share2 size={14} />
          </button>
      </div>

    </div>
  );
};

// Sub-component for clean step layout
const Step = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-sm shadow-[0_0_10px_rgba(168,85,247,0.1)]">
      {num}
    </div>
    <div>
      <h4 className="text-xs font-black uppercase text-white mb-1 tracking-tight">{title}</h4>
      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);