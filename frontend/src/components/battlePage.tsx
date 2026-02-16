import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { 
  Trophy, Sword, Info, Copy, CheckCircle2, 
  XCircle, AlertTriangle, ArrowLeft, Zap, Image as ImageIcon 
} from "lucide-react";

interface BattleHistoryEntry {
  event: string;
  [key: string]: any; // Allows additional properties if needed
}

interface Battle {
  _id: string;
  player1Name: string;
  player2Name: string;
  player1: string;
  player2: string | null;
  amount: number;
  prize: number;
  screenShot: string | null;
  status: string;
  ludoCode: string;
  winner: string | null;
  createdAt: string;
  __v: number;
  history: BattleHistoryEntry[]; // Updated type for history
}


export const BattlePage = ()=>{ 
    const navigate = useNavigate();
    const { battleId, userId, phone} = useUserContext();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reason, setReason] = useState<string>("");
  const [ludoCode, setLudoCode] = useState<string>("");
  const [ woned , setWoned ] = useState(false);
  const [ losed , setLosed ] = useState(false);
  const [ canceled , setCanceled ] = useState(false);
   const divRef = useRef<HTMLDivElement>(null);
  const [ Id, setId ] =useState<string>(() => {
    const stored = localStorage.getItem("battleId");
let battleIdValue = "";
try {
  battleIdValue = stored && stored !== "false" ? JSON.parse(stored) : battleId || "";
} catch {
  console.warn("Invalid JSON detected. Resetting battleId.");
  localStorage.removeItem("battleId");
  battleIdValue = battleId || "";
}
return battleIdValue;

});

const reasons = [
  "No room code",
  "Not joined",
  "Not Playing",
  "Don't want to play",
  "Opponent Abusing",
  "Game not started",
  "Others"
];

useEffect(() => {
    const storedBattleId = localStorage.getItem("battleId");
    const battleIdValue = storedBattleId && typeof(storedBattleId) === typeof(String)? storedBattleId : Id || "";
    setId(battleIdValue);
    localStorage.setItem("battleId", battleIdValue);
  }, [Id]); // Use battleId only when it's updated
  
  
  // Fetch battle details
  useEffect(() => {
    if (!Id) {
      return console.log("battleId not found to fetch", Id);
    }
    const fetchBattleDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/battles/inBattle`, {
          params: { battleId: Id },
        });
        setBattle(response.data);
      } catch (err) {
        console.error("Error fetching battle details:", err);
        alert("Failed to fetch battle details. Please try again later.");
      }
    };
    fetchBattleDetails();
  }, [Id]);
  

  // Cancel Battle
  const canceledBattle = async () => {
    if (!reason) {
      alert("Please select a reason to cancel.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/auth/battles/inBattle/canceled`, {
        battleId: battle?._id,
        reason,
        userId,
        phoneNumber : phone
      });
      navigate("/home");
    } catch (err) {
      console.error("Error canceling battle:", err);
    }
  };

 // Upload Screenshot
const uploadScreenshot = async () => {
  if (!selectedFile || !battle) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("battleId", battle._id);
  formData.append("playerId", userId);
  formData.append("phoneNumber", phone);
  
  console.log("Uploading Screenshot...");
  console.log("Phone Number:", phone);

  try {
    const response = await axios.post(`${API_URL}/api/auth/battles/inBattle/uploads`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      alert("Screenshot uploaded successfully.");
      navigate("/home"); // ✅ Navigate only on success
    } else {
      console.error("Unexpected response:", response);
      alert("Failed to upload screenshot. Please try again.");
    }
  } catch (err) {
    console.error("Error uploading screenshot:", err);
    alert("An error occurred while uploading. Please check your internet connection.");
  }
};

  
  const handleLost = async()=>{
     
    try{
      const response = await axios.post(`${API_URL}/api/auth/battles/inBattle/lost`, { 
         battleId : battle?._id ,
         userId
        });
      if(!response.data){
        console.log("response not found");
      }
    }
    catch(err){
      console.log("Error: "+ err);
    }
  }

  const copyToClipboard = () => {
    if (divRef.current) {
      const text = divRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    }
  };
  const handleLudoCode = async()=>{
     
    try{
      const response = await axios.post(`${API_URL}/api/auth/battles/setLudoCode`, { 
         battleId : battle?._id ,
         ludoCode,
         event : "ludoCode_set",
         details : "ludo Code set"
        });
      if(!response.data){
        console.log("response not found");
      }
    }
    catch(err){
      console.log("Error: "+ err);
    }
  }

    // Function to check if any object in `history` has the specified event
    function iterateHistory(history: { event: string }[] | undefined, event: string): boolean {
      return history?.some(entry => entry.event === event) ?? false;
  }
  


    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto text-gray-100 font-sans pb-10 relative">
            
            {/* Top Navigation */}
            <div className="flex justify-between items-center px-5 pt-12 pb-4 sticky top-0 bg-[#0b0b0d]/80 backdrop-blur-md z-30">
                <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase">
                    <ArrowLeft size={18} /> Exit
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Match ID</span>
                    <span className="text-xs font-mono font-bold text-purple-400 italic">#{Id.slice(-6).toUpperCase()}</span>
                </div>
                <button onClick={() => navigate('/rules')} className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase">
                    Rules <Info size={16} />
                </button>
            </div>

            {/* VERSUS HEADER */}
            <div className="px-5 mt-4">
                <div className="bg-gradient-to-br from-[#1a1a1f] to-[#121217] rounded-[2.5rem] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                        {/* Player 1 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                                <div className="h-full w-full bg-[#1a1a1f] rounded-2xl flex items-center justify-center">
                                    <Zap className="text-blue-500" size={32} />
                                </div>
                            </div>
                            <span className="text-xs font-black uppercase truncate w-24 text-center">{battle?.player1Name}</span>
                        </div>

                        {/* VS Divider */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="bg-red-600/10 text-red-500 p-2 rounded-full border border-red-500/20">
                                <Sword size={20} />
                            </div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Versus</span>
                        </div>

                        {/* Player 2 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-500/20">
                                <div className="h-full w-full bg-[#1a1a1f] rounded-2xl flex items-center justify-center">
                                    <Zap className="text-purple-500" size={32} />
                                </div>
                            </div>
                            <span className="text-xs font-black uppercase truncate w-24 text-center">{battle?.player2Name}</span>
                        </div>
                    </div>

                    {/* Stakes Display */}
                    <div className="flex justify-around mt-8 pt-6 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Entry Fee</p>
                            <p className="text-lg font-black italic text-white">₹{battle?.amount}</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Prize Pool</p>
                            <p className="text-lg font-black italic text-yellow-500">₹{battle?.prize}</p>
                        </div>
                    </div>
                    {/* Decorative Background Icon */}
                    <Trophy className="absolute -right-6 -bottom-6 text-white/5 rotate-12" size={120} />
                </div>
            </div>

            {/* ROOM CODE AREA */}
            <div className="px-5 mt-6">
                <div className="bg-[#1a1a1f] rounded-3xl p-6 border border-white/5 shadow-xl">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Zap size={14} className="text-purple-500" /> Room Configuration
                    </h3>

                    {!iterateHistory(battle?.history, "ludoCode_set") ? (
                        userId === battle?.player1 ? (
                            <div className="space-y-4">
                                <p className="text-[10px] text-gray-500 font-medium px-1">Generate code in Ludo King and paste below:</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Enter Code"
                                        className="flex-1 bg-[#0b0b0d] border border-white/10 rounded-xl px-4 py-3 text-white font-black text-center focus:border-purple-500 outline-none transition-all"
                                        onChange={(e) => setLudoCode(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleLudoCode}
                                        className="bg-purple-600 px-6 rounded-xl font-black text-sm uppercase active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                                    >
                                        Set
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-4 bg-[#0b0b0d] rounded-2xl border border-white/5 animate-pulse">
                                <span className="text-[10px] font-black text-gray-600 uppercase mb-1">Waiting for Host</span>
                                <span className="text-lg font-mono font-black tracking-widest text-white/50">•••• ••••</span>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center justify-between bg-[#0b0b0d] border border-white/10 rounded-2xl p-4 shadow-inner">
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">Room Code</p>
                                <p className="text-xl font-mono font-black tracking-widest text-white leading-none mt-1" ref={divRef}>
                                    {battle?.ludoCode}
                                </p>
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="bg-white/5 hover:bg-white/10 p-3 rounded-xl text-purple-400 transition-all active:scale-90"
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MATCH STATUS CONTROL */}
            <div className="px-5 mt-6">
                <div className="bg-[#1a1a1f] rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Match Result</h3>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-6 font-medium">
                        Report the final score immediately after the match ends. False reports lead to a ban.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setWoned(true)}
                            className="bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-black transition-all active:scale-95 shadow-lg shadow-green-600/10"
                        >
                            I Won
                        </button>
                        <button 
                            onClick={() => setLosed(true)}
                            className="bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-red-600/10"
                        >
                            I Lost
                        </button>
                        <button 
                            onClick={() => setCanceled(true)}
                            className="col-span-2 bg-gray-800 hover:bg-gray-700 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 transition-all active:scale-95"
                        >
                            Request Cancellation
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODALS (Glassmorphism) --- */}

            {/* WON MODAL */}
            {woned && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                    <div className="bg-[#1a1a1f] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative animate-slide-up">
                        <button onClick={() => setWoned(false)} className="absolute top-6 right-6 text-gray-500"><XCircle /></button>
                        <div className="flex flex-col items-center">
                            <div className="bg-green-500/10 p-5 rounded-3xl mb-4"><ImageIcon size={40} className="text-green-500" /></div>
                            <h2 className="text-xl font-black uppercase mb-1">Submit Victory</h2>
                            <p className="text-[11px] text-gray-500 text-center mb-8 px-4 font-medium">Please upload a clear screenshot of the winning game screen.</p>
                            
                            <input type="file" id="upload" className="hidden" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                            <label htmlFor="upload" className="w-full bg-[#0b0b0d] border-2 border-dashed border-white/10 p-6 rounded-2xl text-center cursor-pointer mb-6 group hover:border-green-500/50 transition-all">
                                <span className="text-xs font-black text-gray-400 group-hover:text-green-500">{selectedFile ? selectedFile.name : "Select Screenshot"}</span>
                            </label>

                            <button onClick={uploadScreenshot} className="w-full bg-green-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-black shadow-lg shadow-green-500/20">Submit Result</button>
                        </div>
                    </div>
                </div>
            )}

            {/* LOST MODAL */}
            {losed && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                    <div className="bg-[#1a1a1f] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl text-center animate-slide-up">
                        <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} className="text-red-500" /></div>
                        <h3 className="text-lg font-black uppercase mb-2">Confirm Defeat?</h3>
                        <p className="text-xs text-gray-400 mb-8 leading-relaxed px-4">This action will deduct the entry fee from your wallet. Only confirm if you actually lost.</p>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-gray-800 py-4 rounded-xl font-bold text-xs uppercase" onClick={() => setLosed(false)}>Cancel</button>
                            <button className="flex-1 bg-red-600 py-4 rounded-xl font-bold text-xs uppercase shadow-lg shadow-red-600/20" onClick={() => { handleLost(); navigate('/home'); }}>Yes, I Lost</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CANCEL MODAL */}
            {canceled && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                    <div className="bg-[#1a1a1f] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-slide-up overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-sm uppercase text-purple-400 tracking-widest">Cancel Battle</h3>
                            <button onClick={() => setCanceled(false)}><XCircle className="text-gray-600" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-8">
                            {reasons.map((val) => (
                                <button key={val} onClick={() => setReason(val)} className={`text-[10px] font-bold p-2.5 rounded-xl border transition-all ${reason === val ? "bg-purple-600 border-purple-500 text-white" : "bg-white/5 border-white/5 text-gray-500"}`}>
                                    {val}
                                </button>
                            ))}
                        </div>
                        <button className="w-full bg-purple-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20" onClick={canceledBattle}>Submit Request</button>
                    </div>
                </div>
            )}
        </div>
    );
}