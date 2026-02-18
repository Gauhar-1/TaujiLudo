import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { ShieldCheck, ArrowRight, Smartphone, RefreshCw, ChevronLeft } from "lucide-react";

export const LoginPage = () => {
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const { setUserId, phone, setPhone, setName, setLogin, login, setPhoneNumber, tempotp, settempotp } = useUserContext();

  const isPhoneNumberValid = (phone: string) => /^(\+91)?[6-9]\d{9}$/.test(phone);
  const isOtpValid = (otp: string) => /^\d{6}$/.test(otp);

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Auth persistence check
  useEffect(() => {
    const checkAuth = async () => {
      if (!login) return;
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        if (response.data.success) {
          const userData = response.data.user;
          setUserId(userData.userId);
          setName(userData.name);
          setPhoneNumber(userData.phoneNumber);
          setPhone(userData.phoneNumber);
          setLogin(true);
          navigate("/winCash");
        }
      } catch (error) {
        setLogin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname, login, navigate, setName, setPhone, setPhoneNumber, setUserId, setLogin]);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) setReferralCode(refCode);
  }, [searchParams]);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && sendOtp) {
      timer = setInterval(() => {
        setResendTimeout((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [canResend, sendOtp]);

  const handleSendOtp = async () => {
    if (!isPhoneNumberValid(phone)) {
      toast.error("Enter a valid 10-digit number.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, { phoneNumber: phone });
      if (response.data.success) {
        toast.success("OTP sent!");
        settempotp(response.data.otp);
        setSendOtp(true);
        setResendTimeout(30);
        setCanResend(false);
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpValid(otp)) {
      toast.error("Enter 6-digit OTP.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        phoneNumber: phone,
        otp,
        ref: referralCode
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success("Verified!");
        setUserId(response.data.userId);
        setName(response.data.name);
        setLogin(true);
        setPhone(phone);
        navigate("/winCash");
      }
    } catch (error) {
      toast.error("Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0b0d] flex flex-col items-center justify-center min-h-screen w-full font-sans text-gray-100 p-6 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="z-10 w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <img src="../../logo.png" alt="Logo" className="h-14 object-contain" />
        </div>

        <div className="bg-[#16161a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10">
            {sendOtp && (
                <button 
                    onClick={() => setSendOtp(false)} 
                    className="flex items-center gap-1 text-gray-500 text-xs font-bold mb-4 hover:text-purple-400 transition-colors"
                >
                    <ChevronLeft size={14} /> Edit Number
                </button>
            )}

            <h1 className="text-2xl font-black mb-2 text-white">
              {sendOtp ? "Verification" : "Welcome"}
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              {sendOtp ? `Sent to +91 ${phone}` : "Enter your number to play"}
            </p>

            {!sendOtp ? (
              /* --- PHONE VIEW --- */
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Phone Number</label>
                    <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm border-r border-white/10 pr-2">
                            +91
                        </span>
                        <input
                            type="tel"
                            maxLength={10}
                            className="w-full bg-[#0b0b0d] border border-white/5 focus:border-purple-500 rounded-2xl py-4 pl-20 pr-4 text-white font-bold transition-all"
                            placeholder="00000 00000"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    onClick={handleSendOtp}
                    className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20"
                >
                    Get OTP <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              /* --- OTP VIEW --- */
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Security Code</label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full bg-[#0b0b0d] border border-white/5 focus:border-green-500 rounded-2xl py-4 pl-12 pr-4 text-white font-bold tracking-[0.6em] transition-all"
                            placeholder="••••••"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                </div>

                {/* VERIFY BUTTON */}
                <button
                    disabled={isLoading}
                    onClick={handleVerifyOtp}
                    className="w-full bg-green-500 hover:bg-green-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-black transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-green-500/20"
                >
                    {isLoading ? "Verifying..." : "Verify & Play"} <ArrowRight size={16} />
                </button>

                {/* SEPARATE RESEND BUTTON */}
                <div className="flex flex-col items-center gap-3 pt-2">
                    <button
                        disabled={!canResend || isLoading}
                        onClick={handleSendOtp}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
                            ${canResend 
                                ? "text-purple-400 hover:text-purple-300" 
                                : "text-gray-600 cursor-not-allowed"}`}
                    >
                        <RefreshCw size={12} className={!canResend ? "" : "animate-spin-slow"} />
                        {canResend ? "Resend OTP Now" : `Resend in ${resendTimeout}s`}
                    </button>
                </div>
              </div>
            )}
            
            {/* Testing Hint */}
            {sendOtp && tempotp && (
              <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Dev Mode OTP</p>
                <p className="font-mono text-purple-400 font-bold tracking-tighter">{tempotp}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};