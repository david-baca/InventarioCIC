import React from 'react';
import { FiDownload } from 'react-icons/fi'; // Asegúrate de instalar react-icons

const DownloadButton = () => {
  return (
    <button className="w-full bg-orange-600 text-white py-2 flex items-center justify-center gap-2 rounded-full hover:bg-orange-700 transition duration-300">
      <FiDownload className="text-xl" />
      Descargar Acuse
    </button>
  );
};

export default DownloadButton;
