import axios from "axios";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { socket } from "./homePage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sword, Trophy, Trash2, XCircle, PlayCircle, Clock } from "lucide-react";

export const BettingCard = (props: any) => {
    const { userId, setBattleId, name, amount } = useUserContext();
    const navigate = useNavigate();

    const joinBattle = async () => {
        if (!amount) return console.log("Amount not found");
        try {
            const response = await axios.post(`${API_URL}/api/auth/battles/join`, {
                name,
                userId,
                battleId: props.battle._id,
                amount
            });
            if (!response.data) toast.error("Server error");
        } catch (err: any) {
            const message = err.response?.data?.message || "Error joining battle";
            toast.warn(message);
        }
    };

    const deleteBattle = () => {
        socket.emit("deleteBattle", props.battle._id);
    };

    const manageRequest = async (event: string, details: string) => {
        try {
            await axios.post(`${API_URL}/api/auth/battles/manageRequest`, {
                event,
                details,
                battleId: props.battle._id,
                userId
            });
        } catch (err) {
            console.log("Error: " + err);
        }
    };

    const iterateHistory = (history: { event: string }[], event: string): boolean => {
        return history.some(entry => entry.event === event);
    }

    const hasOpponentFound = iterateHistory(props.battle.history, "opponent_found");
    const hasPlayerEntered = iterateHistory(props.battle.history, "player_entered");

    return (
        <div className="mx-4 my-2 group">
            <div className="bg-[#1a1a1f] border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-purple-500/30 active:scale-[0.98]">
                
                {/* Header: Challenge Title */}
                <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Sword size={14} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {props.battle.player1Name}'s Challenge
                        </span>
                    </div>
                    {hasOpponentFound && (
                        <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-black text-green-500 uppercase">Matched</span>
                        </div>
                    )}
                </div>

                {/* Body: Stats and Actions */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-6">
                        {/* Entry Fee */}
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Entry</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-black text-white italic">₹{props.battle.amount}</span>
                            </div>
                        </div>

                        {/* Winning Prize */}
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-purple-500 uppercase tracking-tighter">Win Prize</span>
                            <div className="flex items-center gap-1 text-purple-400">
                                <Trophy size={12} fill="currentColor" className="opacity-50" />
                                <span className="text-sm font-black italic">₹{props.battle.prize}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Zone */}
                    <div className="flex gap-2">
                        {userId === props.battle.player1 ? (
                            <>
                                <button 
                                    onClick={() => {
                                        setBattleId(props.battle._id);
                                        if(hasOpponentFound){
                                            manageRequest("player_entered",`${props.battle.player1Name} joined`);
                                            navigate('/battle');
                                        }
                                    }}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        hasOpponentFound 
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {hasOpponentFound ? <PlayCircle size={14} /> : <Clock size={14} />}
                                    {hasOpponentFound ? "Play" : "Wait"}
                                </button>
                                <button 
                                    onClick={deleteBattle}
                                    className="p-2.5 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        ) : userId === props.battle.player2 && hasOpponentFound ? (
                            <>
                                <button 
                                    onClick={() => {
                                        if(hasPlayerEntered){
                                            setBattleId(props.battle._id);
                                            manageRequest("opponent_entered", `${props.battle.player2Name} joined`);
                                            navigate('/battle');
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        hasPlayerEntered 
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                                        : "bg-gray-800 text-gray-400"
                                    }`}
                                >
                                    {hasPlayerEntered ? "Enter Match" : "Requested"}
                                </button>
                                <button 
                                    onClick={() => manageRequest("opponent_canceled", `Left`)}
                                    className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <XCircle size={16} />
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    setBattleId(props.battle._id);
                                    manageRequest("opponent_found" , `Matched`);
                                    joinBattle();
                                }}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                            >
                                Play Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};