import { getAuth, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const handleLogout = async () => {
  const auth = getAuth()
  const navigate = useNavigate()

  try {
    await signOut(auth)
    toast.success('Logged out successfully!')
    navigate('/login')
  } catch (error) {
    console.error('Error logging out:', error)
    toast.error('Failed to log out. Please try again.')
  }
}

export default handleLogout

