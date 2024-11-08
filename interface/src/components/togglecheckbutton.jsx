import React, { useState } from 'react';

const ToggleCheckButton = () => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div
        onClick={handleClick}
        className={`w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer transition duration-300 ease-in-out 
          ${isSelected ? 'bg-orange-600' : 'bg-white'}`}
      >
        {isSelected && <span className="text-white text-lg font-bold">✓</span>}
      </div>
    </div>
  );
};

export default ToggleCheckButton;
