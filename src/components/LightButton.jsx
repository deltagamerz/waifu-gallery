import React from 'react';

const LightButton = ({ text, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[var(--secondary)] text-[var(--primary)] font-bold text-lg px-4 py-2 rounded-md hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-all duration-300 ${className}`}
    >
      {text}
    </button>
  );
};

export default LightButton;
