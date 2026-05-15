import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCcw, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../utils/config';

const AiInsights = () => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const fetchInsights = async (force = false) => {
    try {
      setHasStarted(true);
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const url = `${API_BASE_URL}/ai/insights${force ? '?forceRefresh=true' : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setInsights(res.data.insights);
      }
    } catch (err) {
      console.error("AI Insights Error:", err);
      const msg = err.response?.data?.message || "";
      if (msg.includes("Quota") || msg.includes("limit") || err.response?.status === 429) {
        setError("AI limits reached for now. Please try again in 1-2 minutes.");
      } else {
        setError("Failed to load AI insights. Make sure you have added some transactions.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual trigger to save API limits

  const formatInsights = (text) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim()).map((line, index) => {
      const cleanLine = line.replace(/^[*-]\s+/, '').replace(/^#+\s+/, '');
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          key={index}
          className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="mt-1">
            {index % 3 === 0 ? <TrendingUp size={18} className="text-emerald-500" /> :
              index % 3 === 1 ? <Lightbulb size={18} className="text-amber-500" /> :
                <AlertCircle size={18} className="text-rose-500" />}
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">{cleanLine}</p>
        </motion.div>
      );
    });
  };

  return (
    <div className="w-full mb-8">
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-[2.5rem] p-8 border border-white shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} className="text-purple-600" />
        </div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white rounded-2xl shadow-sm text-purple-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">AI Financial Insights</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Personalized Analysis by Gemini</p>
            </div>
          </div>
          <button
            onClick={() => fetchInsights(true)}
            disabled={loading}
            className="p-3 bg-white hover:bg-purple-50 text-purple-600 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
          </button>
        </div>

        <div className="relative z-10">
          {!hasStarted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-white rounded-full shadow-inner mb-4">
                <Lightbulb size={32} className="text-purple-400" />
              </div>
              <p className="text-gray-600 font-medium mb-6">Our AI analyse our spending pattern</p>
              <button
                onClick={() => fetchInsights(true)}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-200 active:scale-95"
              >
                Generate AI Insights
              </button>
            </div>
          ) : loading && !insights ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={40} className="animate-spin text-purple-600" />
              <p className="text-purple-600 font-bold animate-pulse">Analyzing your spending patterns...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 font-medium flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formatInsights(insights)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
