import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { Phone, ShieldCheck, Timer, ArrowRight, Smartphone } from "lucide-react";

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
        if (location.pathname === "/") navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) setReferralCode(refCode);
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && sendOtp) {
      timer = setInterval(() => {
        setResendTimeout((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 30;
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
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, { phoneNumber: phone });
      if (response.data.success) {
        toast.success("OTP sent!");
        settempotp(response.data.otp);
        setSendOtp(true);
        setResendTimeout(30);
        setCanResend(false); // Should be false initially to start the timer
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
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
      
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />

      <div className="z-10 w-full max-w-sm">
        {/* Logo Section */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <img src="../../logo.png" alt="Logo" className="h-16 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
        </div>

        {/* Login Card */}
        <div className="bg-[#16161a] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          
          <div className="relative z-10">
            <h1 className="text-2xl font-black mb-2 text-white tracking-tight">
              {sendOtp ? "Verify Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-400 text-sm mb-8 font-medium">
              {sendOtp ? `Enter code sent to +91 ${phone}` : "Login to start winning cash today"}
            </p>

            {/* Phone Input */}
            {!sendOtp ? (
              <div className="space-y-2 mb-6 animate-slide-up">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <Smartphone size={18} />
                  </div>
                  <span className="absolute inset-y-0 left-10 flex items-center text-gray-400 font-bold border-r border-white/10 pr-3 my-3">
                    +91
                  </span>
                  <input
                    type="tel"
                    className="w-full bg-[#1f1f25] border border-white/5 group-hover:border-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none rounded-2xl py-4 pl-24 pr-4 text-white font-bold transition-all placeholder:text-gray-600"
                    placeholder="98765 43210"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              /* OTP Input */
              <div className="space-y-2 mb-6 animate-slide-up">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">6-Digit OTP</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full bg-[#1f1f25] border border-white/5 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none rounded-2xl py-4 pl-12 pr-4 text-white font-bold tracking-[0.5em] transition-all"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                {tempotp && (
                  <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl mt-4">
                    <p className="text-[10px] text-purple-300 uppercase font-black text-center mb-1">Testing Mode OTP</p>
                    <p className="text-center font-mono text-lg text-purple-400 font-bold tracking-widest">{tempotp}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <button
              disabled={isLoading}
              onClick={() => (!sendOtp ? handleSendOtp() : handleVerifyOtp())}
              className={`w-full relative overflow-hidden group py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg
                ${!sendOtp 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20" 
                  : !canResend 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-black shadow-green-500/20"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {!sendOtp ? "Get Secure OTP" : !canResend ? `Resend in ${resendTimeout}s` : "Verify & Play"}
                    <ArrowRight size={18} />
                  </>
                )}
              </div>
            </button>
            
            <p className="text-[10px] text-center text-gray-500 mt-6 font-medium">
                By logging in, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Full Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0d]/80 backdrop-blur-md">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-t-2 border-purple-500 animate-spin" />
            <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400" />
          </div>
        </div>
      )}
    </div>
  );
};