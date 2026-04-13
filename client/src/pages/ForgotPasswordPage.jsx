import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useToast } from "../context/ToastContext";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { showToast } = useToast();

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setOtpSent(true);
      showToast(data.message || "OTP sent to your email", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      showToast(data.message || "Password reset successful", "success");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
        <p className="text-slate-200 mt-1 mb-6">Request OTP and reset your password</p>

        <form onSubmit={otpSent ? submitReset : requestOtp}>
          <input
            className="w-full mb-3 rounded-lg bg-white/20 p-3 placeholder-slate-300"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {otpSent && (
            <>
              <input
                className="w-full mb-3 rounded-lg bg-white/20 p-3 placeholder-slate-300"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
              <input
                className="w-full mb-3 rounded-lg bg-white/20 p-3 placeholder-slate-300"
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : otpSent
                ? "Reset Password"
                : "Send OTP"}
          </button>
        </form>

        <p className="text-slate-300 text-sm mt-4">
          Back to{" "}
          <Link className="text-indigo-300" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
