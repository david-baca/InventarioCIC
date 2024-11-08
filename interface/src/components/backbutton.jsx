import React from 'react';
import imgBack from "../../../public/back.svg";

const BackButton = () => {
  return (
    <>
    <button
      className="w-full bg-orange-600 text-white py-2 flex items-center justify-center gap-2 rounded-full hover:bg-orange-700 transition duration-300"
    >
      <img src={imgBack} alt="Regresar" className="h-6 w-6" />
      Regresar
    </button>
    </>
  );
};

export default BackButton;
