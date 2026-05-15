import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  X, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Tag
} from 'lucide-react';

/**
 * Premium Reusable Form Component - 1:1 Design Match
 * 
 * @param {string} title - The main title of the form
 * @param {string} subtitle - Small text below the title
 * @param {Array} tabs - Optional array for the top switcher: [{ id, label, icon: LucideIcon, activeColor }]
 * @param {Array} fields - Array of field objects: { name, label, type, placeholder, icon: LucideIcon, options, required }
 * @param {function} onSubmit - Callback function with formData
 * @param {string} buttonText - Text for the submit button
 * @param {object} initialValues - Initial state for the form
 * @param {boolean} loading - Loading state for the button
 * @param {string} themeColor - 'teal' or 'orange'
 */
const ReusableForm = ({ 
  title = "Add New Transaction", 
  subtitle = "TRANSACTION DETAILS", 
  tabs = [], 
  fields = [], 
  onSubmit, 
  buttonText = "Add Transaction", 
  initialValues = {}, 
  loading = false,
  themeColor = "orange" 
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...formData, activeTab });
  };

  const themes = {
    teal: {
      gradient: "from-teal-500 to-emerald-500",
      bgLight: "from-teal-50 to-emerald-50",
      text: "text-teal-600",
      ring: "focus:ring-teal-500/10",
      shadow: "shadow-teal-500/30",
      badgeIcon: PlusCircle
    },
    orange: {
      gradient: "from-orange-500 to-amber-500",
      bgLight: "from-orange-50/50 to-amber-50/50",
      text: "text-orange-600",
      ring: "focus:ring-orange-500/10",
      shadow: "shadow-orange-500/30",
      badgeIcon: PlusCircle
    }
  };

  const activeTheme = themes[themeColor] || themes.orange;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] border border-white overflow-hidden"
      >
        <div className={`p-10 pb-8 bg-gradient-to-br ${activeTheme.bgLight}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-50">
                <activeTheme.badgeIcon size={28} className={activeTheme.text} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
                  {title}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">
                  {subtitle}
                </p>
              </div>
            </div>
            <button type="button" className="p-3 bg-white/80 hover:bg-white text-gray-400 rounded-full transition-all shadow-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-7">
          {tabs.length > 0 && (
            <div className="p-1.5 bg-gray-50 rounded-[1.5rem] flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.2rem] font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50 scale-[1.02]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.icon && <tab.icon size={20} className={activeTab === tab.id ? tab.activeColor : 'text-gray-300'} />}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.name} className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  {field.label}
                </label>
                
                <div className="relative group">
                  {field.icon && (
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors pointer-events-none">
                      <field.icon size={22} />
                    </div>
                  )}

                  {field.type === 'select' ? (
                    <div className="relative">
                      <select
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        className={`w-full bg-gray-50/80 border-2 border-transparent rounded-[1.4rem] ${field.icon ? 'pl-14' : 'px-6'} pr-12 py-5 text-gray-700 font-bold appearance-none transition-all duration-200 focus:bg-white focus:border-gray-100 focus:ring-8 ${activeTheme.ring} outline-none cursor-pointer`}
                      >
                        <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Tag size={20} />
                      </div>
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={`w-full bg-gray-50/80 border-2 border-transparent rounded-[1.4rem] ${field.icon ? 'pl-14' : 'px-6'} pr-6 py-5 text-gray-700 font-bold placeholder:text-gray-300 transition-all duration-200 focus:bg-white focus:border-gray-100 focus:ring-8 ${activeTheme.ring} outline-none`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${activeTheme.gradient} text-white py-6 rounded-[1.8rem] font-black text-xl mt-6 shadow-xl ${activeTheme.shadow} hover:shadow-2xl transition-all duration-300 flex items-center justify-center`}
          >
            {loading ? (
              <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              buttonText
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReusableForm;

/**
 * EXAMPLE USAGE (100% Match with Screenshot):
 * 
 * import Form from './assets/form/Form';
 * import { ArrowUpCircle, ArrowDownCircle, Layout, IndianRupee, Tag, Calendar } from 'lucide-react';
 * 
 * const tabs = [
 *   { id: 'income', label: 'Income', icon: ArrowUpCircle, activeColor: 'text-teal-500' },
 *   { id: 'expense', label: 'Expense', icon: ArrowDownCircle, activeColor: 'text-orange-500' }
 * ];
 * 
 * const fields = [
 *   { name: 'description', label: 'Description', type: 'text', icon: Layout, placeholder: 'Rent, Groceries, etc.' },
 *   { name: 'amount', label: 'Amount', type: 'number', icon: IndianRupee, placeholder: '0.00' },
 *   { name: 'category', label: 'Category', type: 'select', icon: Tag, options: ['Food', 'Rent', 'Travel'] },
 *   { name: 'date', label: 'Transaction Date', type: 'date', icon: Calendar }
 * ];
 * 
 * return <Form title="Add New Transaction" subtitle="TRANSACTION DETAILS" tabs={tabs} fields={fields} themeColor="orange" />;
 */
