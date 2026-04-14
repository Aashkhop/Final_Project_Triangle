import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useUser(); // To auto-login after verification

  // State for the main registration form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    // ✨ REMOVED: phone_number state is no longer needed
  });

  // New state for the OTP flow
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);

  // General state for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Step 1: Handle sending the OTP to the user's email ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // The formData no longer includes the phone_number
      const res = await axios.post("/api/auth/register/send-otp", formData);
      setMessage({
        type: "success",
        // ✨ UPDATED: Success message now refers to email
        text: res.data.message || "OTP sent to your email successfully!",
      });
      setShowOtpForm(true); // Show the OTP input form
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to send OTP. Please check your details.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Handle verifying the OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // This logic remains the same, it correctly uses email for verification
      const res = await axios.post("/api/auth/register/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      setMessage({
        type: "success",
        text: res.data.message || "Verification successful!",
      });

      // Automatically log the user in after verification
      login(res.data.user);

      setTimeout(() => {
        navigate("/"); // Redirect to the homepage
      }, 800);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error || "Verification failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const commonInputClasses = "w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition";
  const commonButtonClasses = "w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center";

  const loadingSpinner = (
    <>
      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0f223a] px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-emerald-500/20">
        {/* Logo / Brand */}
        <h1 className="text-center text-3xl font-extrabold mb-8">
          <span className="text-emerald-400">Project</span>
          <span className="text-white">Triangle</span>
        </h1>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
          {showOtpForm ? "Verify your Account" : "Create your account"}
        </h2>

        {/* Feedback Messages */}
        {message.text && (
          <div className={`mb-5 p-3 rounded-lg text-sm font-medium text-center animate-fadeIn ${
              message.type === "success"
                ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md"
                : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
            }`}>
            {message.text}
          </div>
        )}

        {/* --- CONDITIONAL FORM RENDERING --- */}

        {!showOtpForm ? (
          // --- REGISTRATION FORM ---
          <form onSubmit={handleSendOtp} className="space-y-5">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className={commonInputClasses}/>
            <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required className={commonInputClasses}/>

            {/* ✨ REMOVED: Phone number input field is gone ✨ */}

            <input type="password" name="password" placeholder="Password (min. 6 characters)" value={formData.password} onChange={handleChange} required className={commonInputClasses}/>
            <select name="role" value={formData.role} onChange={handleChange} className={commonInputClasses}>
              <option value="user">User</option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
            <button type="submit" disabled={loading} className={commonButtonClasses}>
              {loading ? <>{loadingSpinner} Get OTP...</> : "Register"}
            </button>
          </form>
        ) : (
          // --- OTP VERIFICATION FORM ---
          <form onSubmit={handleVerifyOtp} className="space-y-5">

            {/* ✨ UPDATED: Message now shows the email address ✨ */}
            <p className="text-center text-gray-300 text-sm">
              An OTP has been sent to <strong>{formData.email}</strong>. Please enter it below.
            </p>

            <input type="text" name="otp" placeholder="Enter 6-character OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" className={`${commonInputClasses} text-center tracking-[0.5em]`}/>
            <button type="submit" disabled={loading} className={commonButtonClasses}>
              {loading ? <>{loadingSpinner} Verifying...</> : "Verify Account"}
            </button>
            <button type="button" disabled={loading} onClick={handleSendOtp} className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 transition mt-2">
              Resend OTP
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-2 hover:underline transition">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;