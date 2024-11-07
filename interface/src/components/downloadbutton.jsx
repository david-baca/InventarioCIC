import React from 'react';
import imgDownload from "../../../public/download.svg"; 

const DownloadButton = () => {
  return (
    <>
    <button className="w-full bg-orange-600 text-white py-2 flex items-center justify-center gap-2 rounded-full hover:bg-orange-700 transition duration-300">
      <img src={imgDownload} alt="Descargar" className="h-6 w-6" /> 
    </button>
    </>
  );
};

export default DownloadButton;
