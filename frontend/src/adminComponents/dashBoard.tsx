import { useEffect, useState } from "react";
import { StickyTable } from "../utils/dashBoardTable";
import axios from "axios";
import { API_URL } from "../utils/url";
import { 
  Users, Wallet, UserPlus, UserX, Sword, 
  Trophy, CheckCircle2, XCircle, BadgeIndianRupee, 
  ArrowUpCircle, ArrowDownCircle, Clock, ShieldCheck, Zap
} from "lucide-react";

interface AdminDetails {
    totalUsers: number;
    totalUsersWalletBalance: number;
    todayNewUsers: number;
    todayBlockedUsers: number;
    todayGames: number;
    allGames: number;
    totalSuccessGame: number;
    todayCancelGame: number;
    totalAdminCommission: number;
    todayTotalDeposit: number;
    todayTotalWithdraw: number;
    todayWonAmount: number;
    totalPendingKYC: number;
    totalApprovedKYC: number;
    createdAt: string;
  }

export const DashBoard = () => {
    const [adminData, setAdminData] = useState<AdminDetails | null>(null);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.post(`${API_URL}/api/auth/createAdminDetails`);
                setAdminData(response.data.data);
            } catch (err) {
                console.error("Failed to fetch admin details.");
            }
        };
        fetchAdminDetails();
        const interval = setInterval(fetchAdminDetails, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0b0b0d] min-h-screen w-full max-w-md mx-auto pt-24 px-5 pb-20 font-sans text-gray-100">
            
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase text-white">Analytics</h1>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Real-time Overview</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-black text-amber-500 uppercase">Live Feed</span>
                </div>
            </div>

            {/* Section 1: Operations Table */}
            <div className="bg-[#16161a] rounded-[2rem] border border-white/5 overflow-hidden mb-8 shadow-2xl">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                    <Zap size={16} className="text-amber-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Active Battles</h3>
                </div>
                <div className="p-2 overflow-x-auto">
                    <StickyTable />
                </div>
            </div>

            {/* Section 2: User Ecosystem (Blue Theme) */}
            <div className="mb-8">
                <h4 className="px-2 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">User Ecosystem</h4>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                        label="Total Users" 
                        value={adminData?.totalUsers} 
                        icon={<Users size={18} />} 
                        color="blue" 
                    />
                    <StatCard 
                        label="New Today" 
                        value={adminData?.todayNewUsers} 
                        icon={<UserPlus size={18} />} 
                        color="blue" 
                    />
                    <StatCard 
                        label="Blocked" 
                        value={adminData?.todayBlockedUsers} 
                        icon={<UserX size={18} />} 
                        color="purple" 
                    />
                    <StatCard 
                        label="Wallet Total" 
                        value={`₹${adminData?.totalUsersWalletBalance || 0}`} 
                        icon={<Wallet size={18} />} 
                        color="emerald" 
                    />
                </div>
            </div>

            {/* Section 3: Gaming Activity (Red/Gold Theme) */}
            <div className="mb-8">
                <h4 className="px-2 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Battle Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                        label="Today's Games" 
                        value={adminData?.todayGames} 
                        icon={<Sword size={18} />} 
                        color="red" 
                    />
                    <StatCard 
                        label="Total Games" 
                        value={adminData?.allGames} 
                        icon={<Trophy size={18} />} 
                        color="yellow" 
                    />
                    <StatCard 
                        label="Successful" 
                        value={adminData?.totalSuccessGame} 
                        icon={<CheckCircle2 size={18} />} 
                        color="emerald" 
                    />
                    <StatCard 
                        label="Canceled" 
                        value={adminData?.todayCancelGame} 
                        icon={<XCircle size={18} />} 
                        color="gray" 
                    />
                </div>
            </div>

            {/* Section 4: Revenue & Finance (Emerald Theme) */}
            <div className="mb-8">
                <h4 className="px-2 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Financial Matrix</h4>
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-600/20 to-transparent border border-emerald-500/20 rounded-3xl p-6 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Admin Commission</p>
                            <p className="text-3xl font-black italic text-white leading-none">₹{adminData?.totalAdminCommission || 0}</p>
                        </div>
                        <BadgeIndianRupee size={40} className="text-emerald-500/40" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard 
                            label="Today Deposits" 
                            value={`₹${adminData?.todayTotalDeposit}`} 
                            icon={<ArrowUpCircle size={18} />} 
                            color="blue" 
                        />
                        <StatCard 
                            label="Today Withdraws" 
                            value={`₹${adminData?.todayTotalWithdraw}`} 
                            icon={<ArrowDownCircle size={18} />} 
                            color="red" 
                        />
                    </div>
                </div>
            </div>

            {/* Section 5: Security & KYC */}
            <div>
                <h4 className="px-2 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Security Desk</h4>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                        label="Pending KYC" 
                        value={adminData?.totalPendingKYC} 
                        icon={<Clock size={18} />} 
                        color="yellow" 
                        isAlert={!!adminData?.totalPendingKYC && adminData.totalPendingKYC > 0}
                    />
                    <StatCard 
                        label="Approved KYC" 
                        value={adminData?.totalApprovedKYC} 
                        icon={<ShieldCheck size={18} />} 
                        color="emerald" 
                    />
                </div>
            </div>

            {/* Footer Margin */}
            <div className="h-10" />
        </div>
    );
};

// Reusable Stat Component for a unified look
const StatCard = ({ label, value, icon, color, isAlert }: any) => {
    const colors: any = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
        yellow: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        gray: "text-gray-500 bg-gray-500/10 border-white/5",
    };

    return (
        <div className={`bg-[#16161a] border border-white/5 p-5 rounded-3xl relative overflow-hidden transition-all hover:border-white/10 ${isAlert ? 'ring-1 ring-amber-500/50' : ''}`}>
            <div className={`${colors[color]} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="text-xl font-black italic text-white leading-none mb-1">{value || 0}</p>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest truncate">{label}</p>
            
            {isAlert && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
            )}
        </div>
    );
};