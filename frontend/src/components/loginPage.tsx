import axios from "axios";
import { useEffect, useState } from "react";
import {  useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";
import { ShieldCheck, ArrowRight, Smartphone, Mail, RefreshCw, ChevronLeft, Loader2 } from "lucide-react";

export const LoginPage = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resendTimeout, setResendTimeout] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  const { setUserId, phone, setPhone, setName, setLogin, tempotp, settempotp } = useUserContext();

  const isPhoneNumberValid = (num: string) => /^[6-9]\d{9}$/.test(num);
  const isEmailValid = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  // --- Resend Timer ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend) {
      timer = setInterval(() => {
        setResendTimeout((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [canResend]);

  const handleSendOtp = async () => {
    if (!isPhoneNumberValid(phone)) return toast.error("Invalid 10-digit phone number");
    if (!isEmailValid(email)) return toast.error("Please enter a valid email for OTP");

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, { 
        phoneNumber: phone,
        email: email // Sent for Nodemailer
      });

      if (response.data.success) {
        toast.success("OTP sent to your email!");
        settempotp(response.data.otp);
        setIsOtpSent(true);
        setCanResend(false);
        setResendTimeout(30);
      }
    } catch (error) {
      toast.error("Service busy. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit code");

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        phoneNumber: phone,
        otp,
        ref: searchParams.get("ref")
      }, { withCredentials: true });

      if (response.data.success) {
        setUserId(response.data.userId);
        setName(response.data.name);
        setLogin(true);
        setPhone(phone);
        navigate("/winCash");
      }
    } catch (error) {
      toast.error("Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-white/5 rounded-2xl border border-white/10 mb-4 shadow-2xl">
            <img src="/logo.png" alt="TaujiLudo" className="h-12 w-auto" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter italic uppercase">
            Tauji<span className="text-purple-500">Ludo</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Play. Win. Earn.</p>
        </div>

        {/* Card Container */}
        <div className="bg-[#0f0f12]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
          
          {isOtpSent && (
            <button 
              onClick={() => setIsOtpSent(false)}
              className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className={isOtpSent ? "text-center mt-4" : ""}>
            <h3 className="text-2xl font-bold mb-2">
              {isOtpSent ? "Enter Security Code" : "Start Winning"}
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              {isOtpSent ? `We sent a 6-digit code to ${email}` : "Verify your identity to join the battle"}
            </p>
          </div>

          <div className="space-y-5">
            {!isOtpSent ? (
              <>
                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Connection</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-black/40 border border-white/5 focus:border-purple-500/50 rounded-2xl py-4 pl-12 pr-4 text-white font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email for OTP</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-black/40 border border-white/5 focus:border-purple-500/50 rounded-2xl py-4 pl-12 pr-4 text-white font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={18} /></>}
                </button>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-4">
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    <input 
                      type="text"
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="0 0 0 0 0 0"
                      className="w-full bg-black/40 border border-green-500/30 focus:border-green-500 rounded-2xl py-5 pl-12 pr-4 text-white text-center text-2xl font-black tracking-[0.5em] transition-all outline-none"
                    />
                  </div>

                  <button 
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-black flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Access Account <ArrowRight size={18} /></>}
                  </button>

                  <button
                    disabled={!canResend || isLoading}
                    onClick={handleSendOtp}
                    className="w-full text-center text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-colors disabled:opacity-30"
                  >
                    {canResend ? (
                      <span className="flex items-center justify-center gap-2"><RefreshCw size={14} /> Resend OTP</span>
                    ) : (
                      `Request again in ${resendTimeout}s`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em] font-bold">
          Secure encrypted 256-bit connection
        </p>
      </div>

      {/* Dev Hint (Matches your context) */}
      {isOtpSent && tempotp && (
        <div className="mt-8 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full animate-bounce">
          <p className="text-[10px] text-purple-400 font-mono">DEBUG MODE OTP: {tempotp}</p>
        </div>
      )}
    </div>
  );
};