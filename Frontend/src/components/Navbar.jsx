import { useEffect, useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import piggy from '../assets/piggy.svg'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User, Settings } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import API_BASE_URL from '../utils/config'

const BASE_URL = API_BASE_URL

const Navbar = ({ user: propUser, onLogout, token }) => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(propUser || {
    name: '',
    email: '',
  })

  // to fetch user data if not passed as prop
  useEffect(() => {
    if (propUser) {
      setUser(propUser)
      return
    }

    const fetchUserData = async () => {
      try {
        const storedToken = token || localStorage.getItem('token')
        if (!storedToken) return

        const response = await axios.get(`${BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })

        const userData = response.data.user || response.data
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [propUser, token])

  // outside mouse click menu close handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout()
    setIsDropdownOpen(false)
    navigate('/login')
  }

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        {/* Logo and App Name */}
        <div className={navbarStyles.logoContainer} onClick={handleLogoClick}>
          <div className={navbarStyles.logoImage}>
             <img src={piggy} alt='logo' className="w-full h-full object-contain" />
          </div>
          <span className={navbarStyles.logoText}><b>Vantage</b></span>
        </div>

        {/* Right Side: User Profile */}
        <div className={navbarStyles.userContainer} ref={dropdownRef}>
          <button 
            className={navbarStyles.userButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="relative">
              <div className={navbarStyles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className={navbarStyles.statusIndicator}></div>
            </div>
            <div className={navbarStyles.userTextContainer}>
              <p className={navbarStyles.userName}>{user?.name || 'User'}</p>
              <p className={navbarStyles.userEmail}>{user?.email || 'user@example.com'}</p>
            </div>
            <ChevronDown className={navbarStyles.chevronIcon(isDropdownOpen)} />
          </button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={navbarStyles.dropdownMenu}
              >
                <div className={navbarStyles.dropdownHeader}>
                  <div className="flex items-center gap-3">
                    <div className={navbarStyles.dropdownAvatar}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className={navbarStyles.dropdownName}>{user?.name || 'User'}</p>
                      <p className={navbarStyles.dropdownEmail}>{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>

                <div className={navbarStyles.menuItemContainer}>
                  <button 
                    className={navbarStyles.menuItem}
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  {/* <button className={navbarStyles.menuItem}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button> */}
                </div>

                <div className={navbarStyles.menuItemBorder}>
                  <button 
                    className={navbarStyles.logoutButton}
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
