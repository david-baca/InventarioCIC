import React from 'react';
import imgArrowUpRight from "../../../public/centericonbuton.svg"; 

const CenterIconButton = () => {
  return (
    <>
    <div className="w-full flex justify-center items-center">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-orange-600 flex items-center justify-center rounded-md text-white hover:bg-orange-700 transition duration-300"
      >
        <img src={imgArrowUpRight} alt="Ir" className="h-5 w-5" /> 
      </a>
    </div>
    </>
  );
};

export default CenterIconButton;
