import { useEffect, useState } from "react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import "./index.css"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ForgotPassword from "./components/ForgotPassword"
import axios from "axios"
import Income from "./pages/Income"
import Expense from "./pages/Expense"
import Profile from "./pages/Profile"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReusableForm from "./assets/form/Form"
import API_BASE_URL from "./utils/config"
// import ParticleBg from "./components/ParticleBg";

const API_URL = API_BASE_URL

// to get transactions from local storage
const getTransactionFromStorage = () => {
  const saved = localStorage.getItem("transactions")
  return saved ? JSON.parse(saved) : []
}
// to protect the routes
const ProtectedRoute = ({ user, authChecked, children }) => {
  const localToken = localStorage.getItem("token")
  const sessionToken = sessionStorage.getItem("token")
  const hasToken = localToken || sessionToken
  if (!authChecked) return null
  if (!user || !hasToken) return <Navigate to="/login" replace />
  return children
}
// to scroll to top when page reload ya naya page visit
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [location.pathname])
  return null
}

const App = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Force remove dark mode class to ensure pure white theme
    document.documentElement.classList.remove('dark');
    localStorage.removeItem("darkMode");
  }, []);






  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj))
        if (tokenStr) localStorage.setItem("token", tokenStr)
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("token")
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj))
        if (tokenStr) sessionStorage.setItem("token", tokenStr)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
      setUser(userObj || null)
      setToken(tokenStr || null)
    } catch (err) {
      console.error("persistAuth error:", err)
    }
  }

  const clearAuth = () => {
    try {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("token")
    } catch (error) {
      console.error("Error clearing auth data:", error)
    }
    setUser(null)
    setToken(null)
  }



    useEffect(() => {
    (async () => { 
    try {
      const localUserRaw = localStorage.getItem("user")
      const sessionUserRaw = sessionStorage.getItem("user")
      const localToken = localStorage.getItem("token")
      const sessionToken = sessionStorage.getItem("token")
      const storedUser = (localUserRaw || sessionUserRaw)
        ? JSON.parse(localUserRaw || sessionUserRaw)
        : null
      const storedToken = localToken || sessionToken || null
      const tokenFromLocal = !!localToken
      if(storedUser){
        setUser(storedUser)
        setToken(storedToken)
        setAuthChecked(true)
        return
      }
      if(storedToken){
        try{
          const res = await axios.get(`${API_URL}/user/me`, {
            headers: {Authorization: `Bearer ${storedToken}`}
          })
          const profile = res.data
          persistAuth(profile, storedToken, tokenFromLocal)
        }
        catch(e){
          console.error("coul not find profile", e)
          clearAuth()
        }
      }

    }
    catch (err) {
      console.error("Failed to restore auth from storage:", err)
    }
    finally{
      setAuthChecked(true)
      try{
        setTransactions(getTransactionFromStorage())
      }
      catch(e){
        console.error("error loading ", e)
      }
    }
  })()
  }, [])

  useEffect(()=>{
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
    catch(e){
      console.error("error saving the transaction ", e)
    }
  }, [transactions])


  const handleLogin = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember)
    navigate("/")
  }

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
  }

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember)
    navigate("/")
  }

  const updateUserData = (updatedUser) => {
    const isLocal = !!localStorage.getItem("token")
    persistAuth(updatedUser, token, isLocal)
  }



    // transaction helpers
  const addTransaction = (newTransaction) =>
    setTransactions((p) => [newTransaction, ...p]);
  const editTransaction = (id, updatedTransaction) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
    );
  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));
  const refreshTransactions = () =>
    setTransactions(getTransactionFromStorage());


  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="flex flex-col items-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //         <p className="mt-4 text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }


  return (
    <>
      <ScrollToTop />
      {/* <ParticleBg /> */}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} authChecked={authChecked}>
              <Layout 
                onLogout={handleLogout} 
                user={user} 
                token={token}
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction} 
                deleteTransaction={deleteTransaction} 
                refreshTransactions={refreshTransactions}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/income" element={<Income 
            transactions={transactions}
            addTransaction={addTransaction}
            editTransaction={editTransaction} 
            deleteTransaction={deleteTransaction} 
            refreshTransactions={refreshTransactions}
          />} />
          <Route path="/expense" element={<Expense 
            transactions={transactions}
            addTransaction={addTransaction}
            editTransaction={editTransaction} 
            deleteTransaction={deleteTransaction} 
            refreshTransactions={refreshTransactions}
          />} />
          <Route path="/profile" element={<Profile 
            user={user} 
            token={token} 
            onUpdateProfile={updateUserData}
            onLogout={handleLogout}  
          />} />
        </Route>

        <Route path='*' element={<Navigate to={user ? "/" : "/login"} replace={true} />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default App
