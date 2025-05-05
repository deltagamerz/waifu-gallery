import React from 'react'

const DarkButton = ({ text, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[var(--contrast)] text-[var(--secondary)] font-bold text-lg px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${className}`}
    >
      {text}
    </button>
  )
}

export default DarkButton