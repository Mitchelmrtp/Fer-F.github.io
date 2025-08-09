import React from 'react';

const SubcategoryButton = ({ subcat, isActive, onClick }) => (
  <button
    key={subcat.id}
    onClick={onClick}
    className={`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
      isActive ? 'bg-gray-100' : ''
    }`}
  >
    <span className="text-gray-700">{subcat.name}</span>
  </button>
);

export default SubcategoryButton;