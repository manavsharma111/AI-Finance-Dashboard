import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import API_BASE_URL from '../utils/config'

const API_BASE = API_BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate password locally to give real-time feedback
  const isStrongPassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(pass);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/user/forgot-password`, { email });
      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email!");
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error("Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/user/reset-password`, {
        email,
        otp,
        newPassword,
        confirmNewPassword
      });

      if (res.data.success) {
        toast.success("Password reset successfully! Please login with your new password.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please check the OTP and try again.");
    } finally {
      setLoading(false);
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
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex p-4 rounded-3xl bg-teal-50 text-teal-600 mb-4"
            >
              <KeyRound size={28} />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="mt-2.5 text-sm font-bold text-gray-500 max-w-xs mx-auto">
              {step === 1 
                ? "Enter your email and we'll send you a 6-digit OTP to reset your password." 
                : `We sent a verification code to ${email}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOTP} 
                className="space-y-6"
              >
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border-2 border-transparent focus:border-teal-500/30 rounded-2xl outline-none font-bold text-gray-800 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-2">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword} 
                className="space-y-5"
              >
                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Enter 6-Digit OTP</label>
                  <div className="relative group">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border-2 border-transparent focus:border-teal-500/30 rounded-2xl outline-none font-bold text-center text-2xl tracking-[0.5em] text-gray-800 placeholder-gray-300 transition-all"
                    />
                  </div>
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border-2 border-transparent focus:border-teal-500/30 rounded-2xl outline-none font-bold text-gray-800 placeholder-gray-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border-2 border-transparent focus:border-teal-500/30 rounded-2xl outline-none font-bold text-gray-800 placeholder-gray-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Return/Back Options */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Change Email
                  </button>
                  <Link 
                    to="/login" 
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
