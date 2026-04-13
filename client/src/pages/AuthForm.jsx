import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const AuthForm = ({ mode }) => {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { authAction } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await authAction(isSignup ? "signup" : "login", form);
      showToast(isSignup ? "Signup successful" : "Login successful", "success");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white">{isSignup ? "Create account" : "Welcome back"}</h2>
        <p className="text-slate-200 mt-1 mb-6">Smart Placement Preparation Portal</p>
        {isSignup && (
          <input
            className="w-full mb-3 rounded-lg bg-white/20 p-3 placeholder-slate-300"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className="w-full mb-3 rounded-lg bg-white/20 p-3 placeholder-slate-300"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full mb-3 rounded-lg bg-white/20 p-3 placeholder-slate-300"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-300 text-sm mb-3">{error}</p>}
        <button className="w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500">
          {isSignup ? "Sign Up" : "Login"}
        </button>
        {!isSignup && (
          <p className="text-right mt-3">
            <Link className="text-sm text-indigo-300 hover:text-indigo-200" to="/forgot-password">
              Forgot Password?
            </Link>
          </p>
        )}
        <p className="text-slate-300 text-sm mt-4">
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <Link className="text-indigo-300" to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Create one"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
