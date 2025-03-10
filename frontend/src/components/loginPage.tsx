import axios from "axios";
import { useEffect, useState } from "react";
import {  useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";

export const LoginPage = () => {
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const { setUserId , phone, setPhone, setName, setLogin, login , setPhoneNumber } = useUserContext();

  // Validate phone number (basic validation)
  const isPhoneNumberValid = (phone: string) => /^(\+91)?[6-9]\d{9}$/.test(phone);

  // Validate OTP (assuming 6-digit OTP)
  const isOtpValid = (otp: string) => /^\d{6}$/.test(otp);


    const location = useLocation();
  
  
    useEffect(() => {
      const checkAuth = async () => {
        if (!login) {
          console.log("No auth cookie found, skipping auth check.");
          return;
        }
  
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
  
          if (response.data.success) {
            const userData = response.data.user;
            setUserId(userData.userId);
            setName(userData.name);
            setPhoneNumber(userData.phoneNumber);
            setPhone(userData.phoneNumber);
            setLogin(true);
            // Navigate only if coming from the login page
              navigate("/winCash");
          }
        } catch (error) {
          console.error("Authentication failed:", error);
          setLogin(false);

          // Prevent infinite redirects
          if (location.pathname === "/") {
              navigate("/");
            }
        }
      };
  
      checkAuth();
  
      // Cleanup function to avoid unnecessary re-renders
      return () => {};
    }, [location.pathname]); // ✅ Dependency added
    

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
            return 30; // Reset timeout for next cycle
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [canResend, sendOtp]);
  // Send OTP handler
  const handleSendOtp = async () => {
    if (!isPhoneNumberValid(phone)) {
      console.log("phoneNumber: " + phone);
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        phoneNumber : phone,
      });

      if (response.data.success) {
        toast.success("OTP sent successfully!");
        setSendOtp(true);
         setResendTimeout(30); // Reset Timer
        setCanResend(true);
      } else {
        toast.error(response.data.message, {
          autoClose: 1000, // 3 seconds
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Please try again.", {
        autoClose: 1000, // 3 seconds
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    if (!isOtpValid(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }


    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        phoneNumber : phone,
        otp,
        ref: referralCode
      },
      { withCredentials: true } 
    );

      if (response.data.success) {
        toast.success("OTP verified successfully!", {
          autoClose: 1000, // 3 seconds
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setUserId(response.data.userId);
        setName(response.data.name);
        setLogin(true);
        setPhone(phone);
        navigate("/winCash");
      } else {
        toast.error(response.data.message || "Invalid OTP.", {
          autoClose: 1000, // 3 seconds
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error verifying OTP. Please try again.", {
        autoClose: 1000, // 3 seconds
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-gray-200 flex justify-center pt-16 max-w-sm min-h-screen">
      <div className="relative w-full flex flex-col  max-w-sm p-6">
        <div className="py-4 px-2">
        <img src="../../logo.png" alt="" />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-serif text-center mb-2">Login Here!</h1>

          {/* Phone Number Input */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex mt-1">
              <span className="bg-gray-200 border border-r-0 border-gray-300 text-gray-600 px-3 py-2 rounded-l-md">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                className="bg-white border border-gray-300 text-gray-700 p-2 w-full rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your phone number"
                onChange={(e) => setPhone(e.target.value)}
                
              />
            </div>
          </div>

          {/* OTP Input (conditionally rendered) */}
          {sendOtp && (
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                className="bg-white border border-gray-300 text-gray-700 p-2 w-full rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
          )}

          {/* Action Button */}
          <button
        className="bg-purple-600 text-white w-full py-2 rounded-md text-center hover:bg-indigo-700"
        onClick={() => {
          if (!sendOtp) {
            handleSendOtp();
          } else if (canResend) {
            handleVerifyOtp();
          }
        }}
      >
        {!sendOtp
          ? "Send OTP"
          : !canResend
          ? `Resend in ${resendTimeout}s`
          : "Verify OTP"}
      </button>
        </div>
      </div>
    </div>
  );
};
