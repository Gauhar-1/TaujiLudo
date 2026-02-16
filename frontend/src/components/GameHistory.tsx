import axios from "axios"
import { useEffect, useState } from "react"
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { Trophy, Sword, Zap, ShieldAlert, History, IndianRupee, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GameHistory = () => {
    const [battles, setBattles] = useState<any[]>([]);
    const { userId } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        const handleBattleHistory = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`${API_URL}/api/auth/battles/battleHistory`, { params: { userId } });
                if (response.data) {
                    setBattles(response.data);
                }
            } catch (err) {
                console.log("error: " + err);
            }
        }

        handleBattleHistory();
        const interval = setInterval(handleBattleHistory, 10000);
        return () => clearInterval(interval);
    }, [userId]);

    const decideWinnerName = (battle: any) => {
        if (["canceled", "in-progress", "disputed"].includes(battle.status)) {
            return "N/A";
        }
        return battle.dispute?.winner === battle.player1 ? battle.player1Name : battle.player2Name;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            case "canceled": return "text-gray-500 bg-gray-500/10 border-gray-500/20";
            case "disputed": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        }
    }

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto text-gray-100 font-sans pb-24">
            {/* Page Header */}
            <div className="sticky top-0 z-30 bg-[#0b0b0d]/80 backdrop-blur-md border-b border-white/5 px-6 pt-12 pb-4 flex items-center gap-4">
                <div className="bg-purple-500/20 p-2 rounded-xl text-purple-500">
                    <History size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-black italic tracking-tight uppercase leading-none">Battle Records</h1>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Your Match Performance</p>
                </div>
            </div>

            <div className="px-4 pt-6 space-y-4">
                {battles.length > 0 ? (
                    battles.map(battle => {
                        const isWinner = battle.dispute?.winner === userId;
                        const isCanceled = battle.status === "canceled";

                        return (
                            <div key={battle._id} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-5 shadow-xl relative overflow-hidden group">
                                
                                {/* Top Row: Status and Date */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(battle.status)}`}>
                                        {battle.status}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Clock size={10} />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                                            {new Date(battle.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Versus Section */}
                                <div className="flex justify-between items-center relative z-10 px-2">
                                    <div className="flex flex-col items-center gap-2 w-24">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-colors ${battle.dispute?.winner === battle.player1 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}>
                                            <Zap size={20} className={battle.dispute?.winner === battle.player1 ? 'text-emerald-500' : 'text-gray-600'} />
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase truncate text-center w-full">{battle.player1Name}</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="bg-[#1f1f25] p-2 rounded-full border border-white/5 shadow-inner">
                                            <Sword size={14} className="text-gray-600" />
                                        </div>
                                        <span className="text-[8px] font-black text-gray-700 uppercase mt-1">Vs</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 w-24">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-colors ${battle.dispute?.winner === battle.player2 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}>
                                            <Zap size={20} className={battle.dispute?.winner === battle.player2 ? 'text-emerald-500' : 'text-gray-600'} />
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase truncate text-center w-full">{battle.player2Name}</span>
                                    </div>
                                </div>

                                {/* Result Info Card */}
                                <div className="mt-6 bg-[#1f1f25] rounded-2xl p-4 flex justify-between items-center border border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Winning Prize</p>
                                        <p className="text-sm font-black italic text-emerald-500">₹{battle.prize}</p>
                                    </div>
                                    <div className="text-right">
                                        {isCanceled ? (
                                            <span className="text-[10px] font-black text-gray-600 uppercase italic">Match Canceled</span>
                                        ) : (
                                            <>
                                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Winner</p>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {isWinner && <Trophy size={12} className="text-yellow-500" />}
                                                    <span className={`text-[10px] font-black uppercase ${isWinner ? 'text-yellow-500' : 'text-gray-300'}`}>
                                                        {decideWinnerName(battle)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Entry Fee Pill */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                                    <Trophy size={100} />
                                </div>
                            </div>
                        )
                    })
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center pt-20 text-center px-10">
                        <div className="bg-[#16161a] p-8 rounded-full mb-6 border border-white/5 shadow-inner text-gray-700">
                            <Sword size={48} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No Battles Yet</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Your arena history is empty. Start your first challenge and build your legacy!
                        </p>
                        <button 
                            onClick={() => navigate('/home')}
                            className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                        >
                            Find A Battle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}