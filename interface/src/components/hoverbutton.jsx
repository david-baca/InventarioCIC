import React from 'react';

const HoverButton = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <button className="w-48 h-12 border border-gray-300 text-gray-600 text-center transition duration-300 ease-in-out 
        hover:bg-orange-600 hover:text-white">
        Example content
      </button>
    </div>
  );
};

export default HoverButton;
