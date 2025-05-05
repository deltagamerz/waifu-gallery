import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Navbar from '../../sections/Navbar'

const ADMIN_EMAIL = "deltagamerz2712@gmail.com"

const Admin = () => {
    const [imageLinks, setImageLinks] = useState([''])
    const [loading, setLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [activeSection, setActiveSection] = useState('manage') // 'manage' or 'add'
    const [images, setImages] = useState([])
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const navigate = useNavigate()
    const auth = getAuth()
    const db = getFirestore()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login')
                return
            }

            if (user.email !== ADMIN_EMAIL) {
                toast.error('Unauthorized access')
                navigate('/home')
                return
            }

            setIsAdmin(true)
        })
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
                setImages(imagesList)
            } catch (error) {
                console.error("Error fetching images: ", error)
                toast.error('Failed to fetch images')
            }
        }

        if (isAdmin) {
            fetchImages()
        }
    }, [db, isAdmin])

    const handleAddLink = () => {
        setImageLinks([...imageLinks, ''])
    }

    const handleLinkChange = (index, value) => {
        const newLinks = [...imageLinks]
        newLinks[index] = value
        setImageLinks(newLinks)
    }

    const handleRemoveLink = (index) => {
        const newLinks = imageLinks.filter((_, i) => i !== index)
        setImageLinks(newLinks)
    }

    const handleDeleteImage = async (imageId) => {
        try {
            await deleteDoc(doc(db, 'images', imageId))
            setImages(images.filter(img => img.id !== imageId))
            toast.success('Image deleted successfully!')
            setDeleteConfirm(null)
        } catch (error) {
            console.error('Error deleting image:', error)
            toast.error('Failed to delete image')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const validLinks = imageLinks.filter(link => link.trim() !== '')

            if (validLinks.length === 0) {
                toast.error('Please add at least one image link')
                return
            }

            for (const link of validLinks) {
                const timestamp = Date.now() + Math.random()
                const imageDoc = doc(db, 'images', `image_${timestamp}`)

                await setDoc(imageDoc, {
                    urls: [link],
                    createdAt: new Date(),
                    userId: auth.currentUser.uid,
                    isAdmin: true
                }, { merge: true })
            }

            toast.success('Images added successfully!')
            setImageLinks([''])
        } catch (error) {
            console.error('Error adding images:', error)
            toast.error('Failed to add images. Please check Firestore rules.')
        } finally {
            setLoading(false)
        }
    }

    if (!isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[var(--primary)]">
            <Navbar />
            <div className="flex flex-row h-[calc(100vh-80px)]">
                {/* Vertical Navbar */}
                <div className="w-64 bg-[var(--primary)] text-[var(--secondary)] p-4">
                    <button
                        onClick={() => setActiveSection('manage')}
                        className={`w-full p-3 mb-2 rounded ${activeSection === 'manage' ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'hover:bg-opacity-20 hover:bg-[var(--primary)]'}`}
                    >
                        Manage Images
                    </button>
                    <button
                        onClick={() => setActiveSection('add')}
                        className={`w-full p-3 rounded ${activeSection === 'add' ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'hover:bg-opacity-20 hover:bg-[var(--primary)]'}`}
                    >
                        Add Images
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 px-6 py-2 overflow-y-auto">
                    {activeSection === 'manage' ? (
                        <div>
                            <h1 className='text-5xl font-bold text-[var(--secondary)] mb-8'>Manage Images</h1>
                            <div className="columns-2 md:columns-4 lg:columns-5 gap-4">
                                {images.map(image => (
                                    <div key={image.id} className="relative mb-4 group">
                                        <img
                                            src={image.urls[0]}
                                            alt={`Gallery Image ${image.id}`}
                                            className="w-full rounded-lg"
                                        />
                                        <button
                                            onClick={() => setDeleteConfirm(image.id)}
                                            className="absolute bottom-2 right-2 bg-red-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Images</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {imageLinks.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="url"
                                                value={link}
                                                onChange={(e) => handleLinkChange(index, e.target.value)}
                                                placeholder="Enter image URL"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                        {imageLinks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveLink(index)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={handleAddLink}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Add Another Image
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Images'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-transperent bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete this image?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteImage(deleteConfirm)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin
