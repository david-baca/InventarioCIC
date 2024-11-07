import React, { useState } from 'react';

const ToggleButton = () => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center cursor-pointer transition-colors duration-300
        ${isSelected ? 'bg-orange-600' : 'bg-white'} 
        border border-gray-300 
        md:w-12 md:h-12 w-10 h-10 sm:w-14 sm:h-14 
        rounded-md`}
    >
      {isSelected && (
        <span className="text-white text-lg md:text-xl sm:text-2xl font-bold">
          ✓
        </span>
      )}
    </div>
  );
};

export default ToggleButton;
