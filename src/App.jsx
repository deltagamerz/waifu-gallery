import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Admin from './pages/auth/Admin'
import { Landing, Home } from './pages'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './lib/firebase'


const App = () => {
  const auth = getAuth()
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      // Check if user is admin - you can customize this check based on your needs
      if (user) {
        setIsAdmin(user.email === 'deltagamerz2712@gmail.com') // Replace with your admin check logic
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/admin" element={user && isAdmin ? <Admin /> : <Navigate to="/home" />} />
      </Routes>
    </Router>
  )
}

export default App