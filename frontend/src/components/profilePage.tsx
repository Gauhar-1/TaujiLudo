import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { toast } from "react-toastify";
import { 
  User, Edit3, Mail, Phone, Wallet, ShieldCheck, 
  ShieldAlert, Trophy, Sword, Users, LogOut, Camera, X 
} from "lucide-react";

export const ProfilePage = () => {
  const [editClicked, setEditClicked] = useState(false);
  const [kycClicked, setKycClicked] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const navigate = useNavigate();
  const { name, setName, phone, userId, setPhone, setUserId, setLogin, setPhoneNumber } = useUserContext();
  const [Name, setname] = useState("");
  const [DOB, setDOB] = useState("");
  const [state, setState] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [earnings, setEarnings] = useState(0);
  const [cashWon, setCashWon] = useState(0);
  const [battlePlayed, setBattlePlayed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      if (!phone) return;
      try {
        const response = await axios.get(`${API_URL}/api/auth/findProfile`, { params: { phoneNumber: phone } });
        if (response.data) {
          const { phoneNumber, name, email, userId, kycDetails, totalUserReferalEarning, gameWon, cashWon, gameLost } = response.data[0];
          setName(name);
          setEmail(email);
          setPhone(phoneNumber);
          setUserId(userId);
          setKycStatus(kycDetails.status);
          setEarnings(totalUserReferalEarning);
          setCashWon(cashWon);
          setBattlePlayed(gameWon + gameLost);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchProfile();
  }, [phone]);

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/update-Profile`, { phoneNumber: phone, name, email });
      if (response.data.success) toast.success("Profile Updated!");
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); setEditClicked(false); }
  };

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      if (response.data.success) {
        setUserId(""); setName(""); setPhone(""); setPhoneNumber(""); setLogin(false);
        navigate("/");
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen w-full bg-[#0b0b0d]">
      <div className="h-16 w-16 border-4 border-t-purple-500 border-purple-500/20 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-16 pb-24 px-5 text-gray-100 relative">
      
      {/* --- EDIT PROFILE MODAL --- */}
      {editClicked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-[#1a1a1f] w-full rounded-3xl p-6 border border-white/10 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg">EDIT PROFILE</h3>
              <X className="cursor-pointer text-gray-500" onClick={() => setEditClicked(false)} />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Username</label>
                <input type="text" className="w-full bg-[#25252b] rounded-xl p-3 border border-white/5 outline-none focus:border-purple-500" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <input type="email" className="w-full bg-[#25252b] rounded-xl p-3 border border-white/5 outline-none focus:border-purple-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button className="w-full bg-purple-600 py-3 rounded-xl font-black text-sm uppercase shadow-lg shadow-purple-500/20 mt-4" onClick={updateProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* --- KYC MODAL --- */}
      {kycClicked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 overflow-y-auto">
          <div className="bg-[#1a1a1f] w-full rounded-3xl p-6 border border-white/10 my-10">
            <h3 className="font-black text-lg mb-6">IDENTITY VERIFICATION</h3>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#25252b] p-3 rounded-2xl border border-dashed border-white/10 text-center">
                    <Camera size={20} className="mx-auto text-gray-500 mb-1" />
                    <p className="text-[8px] uppercase font-bold text-gray-400">Front View</p>
                    <input type="file" className="hidden" id="front" onChange={(e) => setSelectedFile(e.target.files![0])} />
                    <label htmlFor="front" className="text-[10px] text-purple-400 font-bold block mt-1 cursor-pointer truncate">{selectedFile ? selectedFile.name : "Upload"}</label>
                  </div>
                  <div className="bg-[#25252b] p-3 rounded-2xl border border-dashed border-white/10 text-center">
                    <Camera size={20} className="mx-auto text-gray-500 mb-1" />
                    <p className="text-[8px] uppercase font-bold text-gray-400">Back View</p>
                    <input type="file" className="hidden" id="back" onChange={(e) => setSelectedFile2(e.target.files![0])} />
                    <label htmlFor="back" className="text-[10px] text-purple-400 font-bold block mt-1 cursor-pointer truncate">{selectedFile2 ? selectedFile2.name : "Upload"}</label>
                  </div>
               </div>
               <input placeholder="Full Name (As per Aadhar)" type="text" className="w-full bg-[#25252b] rounded-xl p-3 border border-white/5 outline-none" onChange={(e) => setname(e.target.value)} />
               <input placeholder="DOB (DD/MM/YYYY)" type="text" className="w-full bg-[#25252b] rounded-xl p-3 border border-white/5 outline-none" onChange={(e) => setDOB(e.target.value)} />
               <input placeholder="State" type="text" className="w-full bg-[#25252b] rounded-xl p-3 border border-white/5 outline-none" onChange={(e) => setState(e.target.value)} />
               <input placeholder="Aadhar Number" type="text" className="w-full bg-[#25252b] rounded-xl p-3 border border-white/5 outline-none" onChange={(e) => setDocumentNumber(e.target.value)} />
               
               <div className="flex gap-2 pt-4">
                 <button className="flex-1 bg-gray-800 py-3 rounded-xl font-bold text-sm" onClick={() => setKycClicked(false)}>Cancel</button>
                 <button className="flex-1 bg-green-600 py-3 rounded-xl font-bold text-sm" onClick={() => { setKycClicked(false); toast.info("Uploading Documents..."); }}>Submit</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN PROFILE HEADER --- */}
      <div className="bg-gradient-to-br from-[#1a1a1f] to-[#121217] rounded-[2rem] p-6 border border-white/5 shadow-2xl mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <button onClick={() => setEditClicked(true)} className="bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Edit3 size={18} className="text-purple-400" />
          </button>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              <User size={40} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-[#1a1a1f]" title="Online"></div>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black truncate tracking-tight">{name}</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
              <ShieldCheck size={12} className="text-purple-500" /> ID: {userId.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-6">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-500" />
            <span className="text-[11px] font-bold text-gray-300">{phone}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <Mail size={14} className="text-gray-500" />
            <span className="text-[11px] font-bold text-gray-300 truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTIONS --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div onClick={() => navigate('/wallet')} className="bg-[#1a1a1f] p-4 rounded-3xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all active:scale-95">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500"><Wallet size={20} /></div>
            <span className="text-xs font-black uppercase">Wallet</span>
          </div>
        </div>

        {kycStatus === "verified" ? (
          <div className="bg-green-500/10 p-4 rounded-3xl border border-green-500/20 flex items-center justify-center gap-2">
            <ShieldCheck size={20} className="text-green-500" />
            <span className="text-[10px] font-black text-green-500 uppercase">Verified</span>
          </div>
        ) : (
          <div onClick={() => setKycClicked(true)} className="bg-red-500/10 p-4 rounded-3xl border border-red-500/20 flex items-center justify-center gap-2 cursor-pointer animate-pulse active:scale-95">
            <ShieldAlert size={20} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase">KYC Needed</span>
          </div>
        )}
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-[#1a1a1f] p-4 rounded-[1.5rem] border border-white/5 text-center">
          <Trophy size={20} className="text-yellow-500 mx-auto mb-3" />
          <h4 className="text-lg font-black italic">₹{cashWon}</h4>
          <p className="text-[8px] text-gray-500 uppercase font-black mt-1">Cash Won</p>
        </div>
        <div className="bg-[#1a1a1f] p-4 rounded-[1.5rem] border border-white/5 text-center">
          <Sword size={20} className="text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-black italic">{battlePlayed}</h4>
          <p className="text-[8px] text-gray-500 uppercase font-black mt-1">Battles</p>
        </div>
        <div className="bg-[#1a1a1f] p-4 rounded-[1.5rem] border border-white/5 text-center">
          <Users size={20} className="text-emerald-500 mx-auto mb-3" />
          <h4 className="text-lg font-black italic">₹{earnings}</h4>
          <p className="text-[8px] text-gray-500 uppercase font-black mt-1">Referral</p>
        </div>
      </div>

      {/* --- LOGOUT BUTTON --- */}
      <button 
        onClick={handleLogOut}
        className="w-full bg-gradient-to-r from-red-600/10 to-red-600/20 border border-red-600/20 text-red-500 py-4 rounded-3xl font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-300 mb-10"
      >
        <LogOut size={18} /> Logout Account
      </button>

    </div>
  );
};