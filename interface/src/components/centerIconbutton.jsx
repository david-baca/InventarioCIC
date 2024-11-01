import React from 'react';
import { HiArrowUpRight } from 'react-icons/hi'; // Asegúrate de instalar react-icons

const CenterIconButton = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-orange-600 flex items-center justify-center rounded-md text-white hover:bg-orange-700 transition duration-300"
      >
        <HiArrowUpRight className="text-lg" />
      </a>
    </div>
  );
};

export default CenterIconButton;
