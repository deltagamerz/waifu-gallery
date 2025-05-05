// Navbar
import React, { useState, useEffect } from 'react'
import DarkButton from '../components/DarkButton'
import { getAuth, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const auth = getAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAdmin(user.email === 'deltagamerz2712@gmail.com')
      }
    })
    return () => unsubscribe()
  }, [auth])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out. Please try again.')
    }
  }

  return (
    <>
        <div id='navbar' className="h-max w-full flex flex-row items-center justify-between bg-transperent p-4 relative transition-all duration-300">
            <a href="/" className='cursor-pointer'>
            <div className="logo text-[var(--secondary)] font-black text-3xl">Logo</div>
            </a>
            
            <button onClick={toggleMenu} className="text-[var(--primary)] z-20 bg-[var(--secondary)] p-4 rounded-lg">
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute h-max top-0 right-4 mt-16 w-max bg-[var(--secondary)] text-[var(--primary)] rounded-lg shadow-lg px-16 py-8 z-10 transition-all duration-300">
                <h1 className='text-4xl font-bold'>Something we have!</h1>
                <hr className='h-[4px] font-bold pt-4 mt-4' />
                <div className="flex flex-col gap-4  font-medium text-3xl">
                <div className="menu-link flex flex-row gap-4 items-center">
                    <div id='dot' className='h-2 w-2 rounded-full bg-[var(--primary)] hidden '></div>
                    <a href="#about" className=''>About</a>
                  </div>
                  
                  <div className="menu-link flex flex-row gap-4 items-center">
                    <div id='dot' className='h-2 w-2 rounded-full bg-[var(--primary)] hidden '></div>
                    <a href="#about" className=''>licence</a>
                  </div>

                  {isAdmin && (
                    <div className="menu-link flex flex-row gap-4 items-center">
                      <div id='dot' className='h-2 w-2 rounded-full bg-[var(--primary)] hidden '></div>
                      <a href="/admin" className=''>Admin Panel</a>
                    </div>
                  )}

                  <DarkButton text="LogOut" className='w-max' onClick={handleLogout} />
                </div>
              </div>
            )}
        </div>
    </>
  )
}

export default Navbar