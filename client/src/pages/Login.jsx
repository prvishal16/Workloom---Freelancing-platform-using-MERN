import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// ─── DUMMY TEST CREDENTIALS ─────────────────────────────────────────────────
// Freelancer Account:
//   Email   : freelancer@test.com
//   Password: Test@1234
//
// Client Account:
//   Email   : client@test.com
//   Password: Test@1234
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_ACCOUNTS = [
  { role: "freelancer", email: "freelancer@test.com", password: "Test@1234" },
  { role: "client",     email: "client@test.com",     password: "Test@1234" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const fillDummy = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      login({ token, user });
      toast.success("✅ Login successful!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>

        {/* ── Dummy Test Credentials Panel ── */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-3">
            🧪 Test Credentials — click to auto-fill
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DUMMY_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => fillDummy(acc)}
                className={`flex flex-col items-start rounded-md border p-3 text-left text-sm transition hover:shadow-md ${
                  acc.role === "freelancer"
                    ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                    : "border-purple-300 bg-purple-50 hover:bg-purple-100"
                }`}
              >
                <span
                  className={`mb-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                    acc.role === "freelancer"
                      ? "bg-emerald-200 text-emerald-700"
                      : "bg-purple-200 text-purple-700"
                  }`}
                >
                  {acc.role}
                </span>
                <span className="text-gray-700 break-all">{acc.email}</span>
                <span className="text-gray-400">{acc.password}</span>
              </button>
            ))}
          </div>
        </div>
        {/* ─────────────────────────────────── */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0112 5.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-1.356 0-2.656-.25-3.853-.705M3.98 8.223l16.04 7.554M3.98 8.223L2.25 6.495" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.187z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
