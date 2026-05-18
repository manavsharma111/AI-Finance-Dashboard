import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, Mail, Lock, Eye, EyeOff, User, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import API_BASE_URL from '../utils/config'

const API_BASE = API_BASE_URL;

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/user/login`, { email, password });
      if (res.data.success) {
        toast.success("Welcome back!");
        if (onLogin) onLogin(res.data.user, rememberMe, res.data.token);
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.requiresVerification) {
        toast.info(err.response.data.message);
        setShowOTP(true);
      } else {
        toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifying(true);
      const res = await axios.post(`${API_BASE}/user/verify-otp`, {
        email,
        otp
      });

      if (res.data.success) {
        toast.success("Email verified successfully!");
        if (onLogin) onLogin(res.data.user, rememberMe, res.data.token);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post(`${API_BASE}/user/resend-otp`, { email });
      if (res.data.success) {
        toast.success("New OTP sent to your email!");
      }
    } catch (err) {
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-teal-500/5 border border-white p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-teal-500/30 mb-6"
            >
              <LogIn className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-2 font-medium">Enter your details to access your dashboard</p>
          </div>

          {showOTP ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Please verify your email. Code sent to <span className="font-bold text-gray-900">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full max-w-[200px] text-center text-3xl font-bold tracking-[0.5em] py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none"
                    placeholder="000000"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={verifying}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                </motion.button>
              </form>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Resend OTP
                </button>
                <button
                  onClick={() => setShowOTP(false)}
                  className="block mx-auto mt-4 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-gray-700 font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-gray-700 font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center px-1">
                <label className="relative flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-400'}`}>
                    {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className="ml-2.5 text-sm font-bold text-gray-600">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-teal-600 font-bold hover:text-teal-700 hover:underline underline-offset-4 transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
