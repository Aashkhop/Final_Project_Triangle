import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showVerifyLink, setShowVerifyLink] = useState(false); // 👈 --- NEW: State to show verification link

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Reset the verify link when the user starts typing again
    setShowVerifyLink(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setShowVerifyLink(false); // 👈 --- NEW: Reset on new submission

    try {
      const res = await axios.post("/api/auth/login", formData);
      login(res.data.user);
      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
      setMessage({
        type: "error",
        text: errorMessage,
      });

      // 👈 --- START: NEW LOGIC FOR UNVERIFIED USERS --- 👉
      // Check if the specific error message from the backend is present
      if (errorMessage.includes("Please verify your email")) {
        setShowVerifyLink(true);
      }
      // 👈 --- END: NEW LOGIC --- 👉

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0f223a] px-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-emerald-500/20 relative">
        
        {/* ✅ Logo / Brand */}
        <h1 className="text-center text-3xl font-extrabold mb-8">
          <span className="text-emerald-400">Project</span>
          <span className="text-white">Triangle</span>
        </h1>

        {/* ✅ Heading */}
        <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
          Log in to continue
        </h2>

        {/* ✅ Feedback messages */}
        {message.text && (
          <div
            className={`mb-5 p-3 rounded-lg text-sm font-medium text-center animate-fadeIn ${
              message.type === "success"
                ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md"
                : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
          />

          {/* ✅ Forgot password */}
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-emerald-400 hover:text-emerald-300 transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* ✅ Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* 👈 --- START: NEW CONDITIONAL LINK --- 👉 */}
        {showVerifyLink && (
            <div className="text-center mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg animate-fadeIn">
                <p className="text-sm text-yellow-300">
                    Your email is not verified.{" "}
                    <Link to="/register" className="font-bold text-yellow-200 hover:underline">
                        Click here to verify.
                    </Link>
                </p>
            </div>
        )}
        {/* 👈 --- END: NEW CONDITIONAL LINK --- 👉 */}


        {/* ✅ Register link */}
        <div className="text-center mt-6 text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-2 hover:underline transition"
          >
            Register to get started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

