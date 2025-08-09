import React from 'react';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    className={`text-lg font-semibold ${
      isActive ? "text-blue-600" : "text-gray-400"
    } relative pb-4 ${
      isActive ? 
      "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default TabButton;