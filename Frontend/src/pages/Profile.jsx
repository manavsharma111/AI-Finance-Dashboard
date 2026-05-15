import React, { useState, useCallback, useEffect, memo } from 'react'
import Modal from 'react-modal'
import { Eye, EyeOff, User, Mail, Calendar, Shield, Save, X, LogOut, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { profileStyles } from '../assets/dummyStyles'
import API_BASE_URL from '../utils/config'

const API_BASE = API_BASE_URL;

Modal.setAppElement('#root');

const PasswordInput = memo(({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
  <div className="space-y-2">
    <label className={profileStyles.passwordLabel}>
      {label}
    </label>
    <div className={profileStyles.passwordContainer}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors">
        <Lock size={20} />
      </div>
      <input
        type={showField ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`${profileStyles.inputWithError} ${
          error ? 'border-red-300 ring-4 ring-red-500/10' : 'border-transparent'
        } pl-12 pr-12`}
        placeholder={`Enter ${label.toLowerCase()}`}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => onToggle(name)}
        className={profileStyles.passwordToggle}
        disabled={disabled}
      >
        {showField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className={profileStyles.errorText}>{error}</p>
    )}
  </div>
));

PasswordInput.displayName = 'PasswordInput';

const Profile = ({ user: initialUser, onUpdateProfile, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ 
    name: initialUser?.name || '', 
    email: initialUser?.email || '',
    joinDate: initialUser?.createdAt ? new Date(initialUser.createdAt).toLocaleDateString() : 'N/A'
  });
  
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getAuthToken = useCallback(() => localStorage.getItem("token"), [])

  const handleApiRequest = useCallback(async (method, endpoint, data = null) => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return null;
    }
    try {
      setLoading(true);
      const config = {
        method,
        url: `${API_BASE}${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response && [401, 403].includes(error.response.status)) {
        onLogout();
        navigate("/login");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, navigate, onLogout]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await handleApiRequest("get", "/user/me");
        if (data && data.user) {
          const userData = {
            name: data.user.name,
            email: data.user.email,
            joinDate: new Date(data.user.createdAt).toLocaleDateString()
          };
          setUser(userData);
          setTempUser(userData);
        }
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }
    };
    fetchUserData();
  }, [handleApiRequest]);

  const handleUpdateProfile = async () => {
    if (!tempUser.name || !tempUser.email) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      const data = await handleApiRequest("put", "/user/profile", {
        name: tempUser.name,
        email: tempUser.email
      });
      if (data.success) {
        setUser({ ...user, name: tempUser.name, email: tempUser.email });
        setEditMode(false);
        toast.success("Profile updated successfully");
        if (onUpdateProfile) onUpdateProfile(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordData.current) errors.current = "Current password is required";
    if (!passwordData.new) errors.new = "New password is required";
    if (passwordData.new.length < 8) errors.new = "Password must be at least 8 characters";
    if (passwordData.new === passwordData.current) errors.new = "New password must be different from current";
    if (passwordData.new !== passwordData.confirm) errors.confirm = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const data = await handleApiRequest("put", "/user/password", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      if (data.success) {
        toast.success("Password changed successfully");
        setShowPasswordModal(false);
        setPasswordData({ current: '', new: '', confirm: '' });
        setPasswordErrors({});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.mainContainer}>
        {/* Header Section */}
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <User size={48} className="text-white" />
          </div>
          <h2 className={profileStyles.userName}>{user.name}</h2>
          <p className={profileStyles.userEmail}>{user.email}</p>
        </div>

        {/* Content Section */}
        <div className={profileStyles.content}>
          <div className={profileStyles.grid}>
            {/* Account Info Card */}
            <div className={profileStyles.card}>
              <div className={profileStyles.cardHeader}>
                <h3 className={profileStyles.cardTitle}>
                  <User className={profileStyles.icon} />
                  Account Details
                </h3>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className={profileStyles.editButton}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={profileStyles.label}>Full Name</label>
                  {editMode ? (
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        value={tempUser.name}
                        onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                        className={`${profileStyles.input} pl-12`}
                        placeholder="Enter your name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <User size={18} />
                      </div>
                      <p className="font-bold text-gray-800">{user.name}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className={profileStyles.label}>Email Address</label>
                  {editMode ? (
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-500 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        value={tempUser.email}
                        onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                        className={`${profileStyles.input} pl-12`}
                        placeholder="Enter your email"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <Mail size={18} />
                      </div>
                      <p className="font-bold text-gray-800">{user.email}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className={profileStyles.label}>Member Since</label>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                      <Calendar size={18} />
                    </div>
                    <p className="font-bold text-gray-800">{user.joinDate}</p>
                  </div>
                </div>

                {editMode && (
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleUpdateProfile}
                      className={profileStyles.buttonPrimary}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      onClick={() => { setEditMode(false); setTempUser({ ...user }); }}
                      className={profileStyles.buttonSecondary}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Card */}
            <div className={profileStyles.card}>
              <div className={profileStyles.cardHeader}>
                <h3 className={profileStyles.cardTitle}>
                  <Shield className={profileStyles.icon} />
                  Security Settings
                </h3>
              </div>
              <div className="space-y-5">
                <div className={profileStyles.securityItem}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className={profileStyles.securityText}>Password</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Last changed: Long ago</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className={profileStyles.changeButton}
                  >
                    Update
                  </button>
                </div>
                
                <div className="pt-6">
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                  >
                    <LogOut size={20} />
                    Logout from Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-[100]"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
      >
        <div className={profileStyles.modalContent}>
          <div className={profileStyles.modalHeader}>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white shadow-sm text-teal-600">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className={profileStyles.modalTitle}>Change Password</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Security Update
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)} 
                className="p-2 bg-white/50 hover:bg-white text-gray-400 hover:text-gray-900 rounded-full transition-all duration-200 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="p-8 pt-6 space-y-5">
            <PasswordInput
              name="current"
              label="Current Password"
              value={passwordData.current}
              showField={showPassword.current}
              onToggle={togglePasswordVisibility}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              error={passwordErrors.current}
            />
            <PasswordInput
              name="new"
              label="New Password"
              value={passwordData.new}
              showField={showPassword.new}
              onToggle={togglePasswordVisibility}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              error={passwordErrors.new}
            />
            <PasswordInput
              name="confirm"
              label="Confirm New Password"
              value={passwordData.confirm}
              showField={showPassword.confirm}
              onToggle={togglePasswordVisibility}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              error={passwordErrors.confirm}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-lg mt-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 active:scale-95"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default Profile