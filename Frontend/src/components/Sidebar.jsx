import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Home,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react'
import { sidebarStyles, cn } from '../assets/dummyStyles'
import { AnimatePresence, motion } from 'framer-motion'

const MENU_ITEMS = [
  { text: 'Dashboard', path: '/', icon: <Home size={20} /> },
  { text: 'Income', path: '/income', icon: <BanknoteArrowUp size={20} /> },
  { text: 'Expenses', path: '/expense', icon: <BanknoteArrowDown size={20} /> },
  { text: 'Profile', path: '/profile', icon: <User size={20} /> },
]

const Sidebar = ({ user, isCollapsed, setIsCollapsed, onLogout }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileSidebarRef = useRef(null)

  const box = {
    width: 100,
    height: 100,
    backgroundColor: "#111",
    borderRadius: 5,
  }

  const username = user?.name || 'User'
  const userEmail = user?.email || 'user@example.com'
  const initial = username.charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout()
    navigate('/login')
    setMobileOpen(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && mobileSidebarRef.current && !mobileSidebarRef.current.contains(event.target)) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileOpen])

  return (
    <>
      <motion.aside
        className={cn(sidebarStyles.sidebarContainer.base, isCollapsed ? 'w-20' : 'w-64')}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          <div
            className={cn(
              sidebarStyles.userProfileContainer.base,
              isCollapsed ? sidebarStyles.userProfileContainer.collapsed : sidebarStyles.userProfileContainer.expanded
            )}
          >
            <div className={cn('flex gap-2', isCollapsed ? 'flex-col items-center' : 'flex-col items-start')}>
              <div className={sidebarStyles.userInitials.base}>{initial}</div>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key='user-meta'
                    className='min-w-0'
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className='text-sm font-semibold text-gray-800 truncate'>{username}</p>
                    <p className='text-xs text-gray-500 truncate'>{userEmail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className='p-2 flex-1 overflow-y-auto'>
            <ul className={sidebarStyles.menuList.base}>
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.path
                return (
                  <motion.li key={item.text} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <motion.button
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        sidebarStyles.menuItem.base,
                        isActive ? sidebarStyles.menuItem.active : sidebarStyles.menuItem.inactive,
                        isCollapsed ? sidebarStyles.menuItem.collapsed : sidebarStyles.menuItem.expanded,
                        'w-full text-left'
                      )}
                      type='button'
                      layout
                    >
                      <span className={isActive ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>{item.icon}</span>
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.span
                            key={item.text}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.16 }}
                          >
                            {item.text}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          <div
            className={cn(
              'mt-auto',
              sidebarStyles.footerContainer.base,
              isCollapsed ? sidebarStyles.footerContainer.collapsed : sidebarStyles.footerContainer.expanded
            )}
          >
            <button onClick={() => setIsCollapsed((prev) => !prev)} className={sidebarStyles.toggleButton.base} type='button'>
              {isCollapsed ? <ArrowBigRightDash size={20} /> : <ArrowBigLeftDash size={20} />}
            </button>

            <motion.button
              onClick={handleLogout}
              className={cn(sidebarStyles.logoutButton.base, isCollapsed && sidebarStyles.logoutButton.collapsed)}
              type='button'
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={20} className='text-gray-600 w-4 h-4' />
              {!isCollapsed && <span className='ml-2 text-sm text-gray-600'>Logout</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      <motion.button
        onClick={() => setMobileOpen((prev) => !prev)}
        className={sidebarStyles.mobileMenuButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type='button'
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className={sidebarStyles.mobileOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className={sidebarStyles.mobileBackdrop}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              ref={mobileSidebarRef}
              className={sidebarStyles.mobileSidebar.base}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className='relative h-full flex flex-col'>
                <div className={sidebarStyles.mobileHeader}>
                  <div className={sidebarStyles.mobileUserContainer}>
                    <div className={sidebarStyles.userInitials.base}>{initial}</div>
                    <div>
                      <h2 className='text-lg font-bold text-gray-800'>{username}</h2>
                      <h3 className='text-sm text-gray-500'>{userEmail}</h3>
                    </div>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className={sidebarStyles.mobileCloseButton} type='button'>
                    <X size={24} className='text-gray-600' />
                  </button>
                </div>
                

                <ul className={sidebarStyles.mobileMenuList}>
                  {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.path
                    return (
                      <li key={`mobile-${item.text}`}>
                        <button
                          onClick={() => handleNavigate(item.path)}
                          className={cn(
                            sidebarStyles.mobileMenuItem.base,
                            isActive ? sidebarStyles.mobileMenuItem.active : sidebarStyles.mobileMenuItem.inactive,
                            'w-full text-left'
                          )}
                          type='button'
                        >
                          {item.icon}
                          <span>{item.text}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>


                  








{/* <motion.div
                  animate={{
                    scale: [1, 2, 2, 1, 1],
                    rotate: [0, 0, 180, 180, 0],
                    borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  style={box}
                /> */}











                <div className={sidebarStyles.mobileFooter}>
                  <motion.button
                    onClick={handleLogout}
                    className={sidebarStyles.mobileLogoutButton}
                    type='button'
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
