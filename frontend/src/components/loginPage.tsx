import axios from "axios";
import { useEffect, useState } from "react";
import {  useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../hooks/UserContext";
import { API_URL } from "../utils/url";

export const LoginPage = () => {
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { setUserId , phoneNumber, setPhoneNumber,setName, setLogin } = useUserContext();

  // Validate phone number (basic validation)
  const isPhoneNumberValid = (phone: string) => /^(\+91)?[6-9]\d{9}$/.test(phone);

  // Validate OTP (assuming 6-digit OTP)
  const isOtpValid = (otp: string) => /^\d{6}$/.test(otp);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) setReferralCode(refCode);
  }, [searchParams]);

  // Send OTP handler
  const handleSendOtp = async () => {
    if (!isPhoneNumberValid(phoneNumber)) {
      console.log("phoneNumber: " + phoneNumber);
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        phoneNumber,
      });

      if (response.data.success) {
        toast.success("OTP sent successfully!");
        setSendOtp(true);
      } else {
        toast.error(response.data.message || "Invalid phone number.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Please try again.");
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
        phoneNumber,
        otp,
        ref: referralCode
      });

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        setUserId(response.data.userId);
        setName(response.data.name);
        setLogin(true);
        setPhoneNumber(phoneNumber);
        navigate("/winCash");
      } else {
        toast.error(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  return (
    <div className="bg-gray-200 flex justify-center items-center max-w-sm min-h-screen">
      <div className="relative w-full max-w-sm p-6">
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                
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
              } else {
                handleVerifyOtp();
              }
            }}
          >
            {sendOtp ? "Verify OTP" : "Send OTP"}
          </button>

         
        </div>
      </div>
    </div>
  );
};
