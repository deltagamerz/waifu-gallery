// This is a home page where every image is going to be diplayed.
import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import Navbar from '../sections/Navbar'

const Home = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const db = getFirestore()
  const [images, setImages] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If user is not logged in, redirect to login page
        navigate('/login')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [auth, navigate])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesCollection = collection(db, 'images')
        const querySnapshot = await getDocs(imagesCollection)
        const imagesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log("Fetched images:", imagesList) // Debug log
        setImages(imagesList)
      } catch (error) {
        console.error("Error fetching images: ", error)
      }
    }

    fetchImages()
  }, [db])

  return (
    <>
      <div id='home-page' className="min-h-screen w-full flex flex-col bg-[var(--primary)]">
        <Navbar />
        <div className="top-content flex flex-col text-[var(--secondary)] pl-4">
          <h1 className='text-4xl font-bold'>Welcome to <span className='text-[var(--secondary)]'>Image Hub</span></h1>
          <p className='text-2xl font-meduim'>"this is a platform for horney anime lover where you can see anime images"</p>
        </div>
        <div className="image-gallery columns-2 md:columns-4 lg:columns-5 xl:columns-7 gap-4 p-4">
          {images && images.length > 0 ? (
            images.map(image => (
              <div key={image.id} className="break-inside-avoid mb-4 w-full">
                <img
                  src={image.urls[0]} // ✅ Access first item in the array
                  alt={`Gallery Image ${image.id}`}
                  className="w-full rounded-lg shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                  onError={(e) => {
                    console.error("Image failed to load:", image.urls[0])
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found"
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center w-full p-4">
              <p className="text-lg text-gray-600">No images found in the gallery</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home