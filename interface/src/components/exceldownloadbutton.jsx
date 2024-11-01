import React from 'react';
import { AiFillFileExcel } from 'react-icons/ai';

const ExcelDownloadButton = () => {
  return (
    <button className="w-full border border-gray-300 text-black py-2 flex items-center justify-center gap-2 rounded-full hover:bg-gray-100 transition duration-300">
      <AiFillFileExcel className="text-green-600 text-2xl" />
      Descargar reporte completo
    </button>
  );
};

export default ExcelDownloadButton;
