import React from 'react';
import imgExcel from "../../../public/dowloadExcel.svg"; 
const ExcelDownloadButton = () => {
  return (
    <>
    <button className="w-full border border-gray-300 text-black py-2 flex items-center justify-center gap-2 rounded-full hover:bg-gray-100 transition duration-300">
      <img src={imgExcel} alt="Descargar Excel" className="h-6 w-6" /> 
      Descargar reporte completo
    </button>
    </>
  );
};

export default ExcelDownloadButton;
