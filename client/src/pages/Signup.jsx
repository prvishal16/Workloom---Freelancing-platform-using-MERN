import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// ─── DUMMY TEST CREDENTIALS ─────────────────────────────────────────────────
// Freelancer Account:
//   Name    : Alex Turner
//   Email   : freelancer@test.com
//   Password: Test@1234
//   Role    : Freelancer
//
// Client Account:
//   Name    : Sara Mitchell
//   Email   : client@test.com
//   Password: Test@1234
//   Role    : Client
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_ACCOUNTS = [
  {
    role: "freelancer",
    label: "Freelancer",
    name: "Alex Turner",
    email: "freelancer@test.com",
    password: "Test@1234",
  },
  {
    role: "client",
    label: "Client",
    name: "Sara Mitchell",
    email: "client@test.com",
    password: "Test@1234",
  },
];

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fillDummy = (account) => {
    setForm({
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/register", form);
      const { token, user } = res.data;

      login({ token, user });

      toast.success("✅ Registration successful!");

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm sm:max-w-md transition-all duration-300 transform hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center tracking-tight">
          Create Your Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Join us and get started on your journey.
        </p>

        {/* ── Dummy Test Credentials Panel ── */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-3">
            🧪 Test Accounts — click to auto-fill
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
                  {acc.label}
                </span>
                <span className="font-medium text-gray-700">{acc.name}</span>
                <span className="text-gray-500 break-all text-xs">{acc.email}</span>
                <span className="text-gray-400 text-xs">{acc.password}</span>
              </button>
            ))}
          </div>
        </div>
        {/* ─────────────────────────────────── */}

        {error && (
          <p className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md mb-6 text-center transition-all duration-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0112 5.5c2.972 0 5.684 1.096 7.787 2.748l1.65-1.65a.75.75 0 00-1.06-1.06L18.373 7.373A12.016 12.016 0 0012 3C8.868 3 5.993 4.157 3.768 5.932l-1.48-1.48a.75.75 0 00-1.06 1.061l1.65 1.65a.75.75 0 00.53.218h.001z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 01-6.5-6.5 6.5 6.5 0 011.08-3.584l-1.08-1.08A7.997 7.997 0 004.5 12a8 8 0 0015.19 3.19l-1.12-1.12A6.47 6.47 0 0112 18.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.183a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.187z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer bg-white"
          >
            <option value="freelancer">I am a Freelancer</option>
            <option value="client">I am a Client</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 transform hover:-translate-y-0.5 shadow-md"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer duration-200"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
