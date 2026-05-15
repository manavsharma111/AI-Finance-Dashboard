import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layout, IndianRupee, Tag, Calendar, PlusCircle, ArrowUpCircle, ArrowDownCircle, Sparkles, Loader2 } from 'lucide-react'
import axios from 'axios'
import { modalStyles } from '../assets/dummyStyles'

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  categories = ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Salary", "Freelance", "Investments", "Bonus", "Other"],
  color = "teal"
}) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentDate = today.toISOString().split('T')[0]
  const minDate = `${currentYear}-01-01`

  const isIncome = newTransaction.type === 'income'
  const themeColor = isIncome ? 'teal' : 'orange'
  const activeGradient = isIncome 
    ? 'from-teal-500 to-emerald-500' 
    : 'from-orange-500 to-amber-500'

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden"
          >
            {/* Header with Gradient Background */}
            <div className={`p-8 pb-6 bg-gradient-to-br ${isIncome ? 'from-teal-50 to-emerald-50' : 'from-orange-50 to-amber-50'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-white shadow-sm ${isIncome ? 'text-teal-600' : 'text-orange-600'}`}>
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                      {title}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                      Transaction Details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-white/50 hover:bg-white text-gray-400 hover:text-gray-900 rounded-full transition-all duration-200 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddTransaction()
              }}
              className="p-8 pt-6 space-y-5"
            >
              {/* Type Switcher (if both types allowed) */}
              {type === "both" && (
                <div className="p-1.5 bg-gray-50 rounded-2xl flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      isIncome 
                        ? 'bg-white text-teal-600 shadow-sm scale-[1.02]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ArrowUpCircle size={18} />
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      !isIncome 
                        ? 'bg-white text-orange-600 shadow-sm scale-[1.02]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ArrowDownCircle size={18} />
                    Expense
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors">
                    <Layout size={20} />
                  </div>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-gray-700 font-medium transition-all duration-200 focus:bg-white focus:border-gray-100 focus:ring-4 ${isIncome ? 'focus:ring-teal-500/10' : 'focus:ring-orange-500/10'} outline-none`}
                    placeholder={isIncome ? "Salary, Project, etc." : "Rent, Groceries, etc."}
                    required
                  />
                </div>
              </div>

              {/* Amount and Category Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Amount
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors">
                      <IndianRupee size={18} />
                    </div>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                      className={`w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-10 pr-4 py-4 text-gray-700 font-bold transition-all duration-200 focus:bg-white focus:border-gray-100 focus:ring-4 ${isIncome ? 'focus:ring-teal-500/10' : 'focus:ring-orange-500/10'} outline-none`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors pointer-events-none">
                      <Tag size={18} />
                    </div>
                    <select
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-10 pr-4 py-4 text-gray-700 font-bold appearance-none transition-all duration-200 focus:bg-white focus:border-gray-100 focus:ring-4 ${isIncome ? 'focus:ring-teal-500/10' : 'focus:ring-orange-500/10'} outline-none cursor-pointer`}
                    >
                      {categories.map((cat) => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Transaction Date
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-gray-700 font-medium transition-all duration-200 focus:bg-white focus:border-gray-100 focus:ring-4 ${isIncome ? 'focus:ring-teal-500/10' : 'focus:ring-orange-500/10'} outline-none`}
                    min={minDate}
                    max={currentDate}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full bg-gradient-to-r ${activeGradient} text-white py-5 rounded-[1.5rem] font-black text-lg mt-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] transition-all duration-300`}
              >
                {buttonText}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddTransactionModal