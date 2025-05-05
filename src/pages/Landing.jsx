// This is a landing page 
import React from 'react'
import LightButton from '../components/LightButton'
import DarkButton from '../components/DarkButton'

const Landing = () => {
  return (
    <>
        <div id='landing-page' className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--primary)] relative overflow-hidden">
            {/* Form */}
            <div>
              
            </div>

            {/* <LightButton text="Get Started" />
            <DarkButton text="Learn More" className='ml-4 cursor-pointer' /> */}
            <div className="image absolute right-0 bottom-0 h-2/3">
              <img className='h-full w-full' src="./images/2.png" alt="image" />
            </div>
        </div>
    </>
  )
}

export default Landing