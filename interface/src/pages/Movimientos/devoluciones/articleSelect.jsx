import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Componente principal de selección de responsable
const ViewRestok_ArticleSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const responsables = [
    { id: 1, token: 'UPQROO-22056', articulo: 'Monitor' },
    { id: 2, token: 'UPQROO-21056', articulo: 'Teclado' },
    { id: 3, token: 'UPQROO-22083', articulo: 'Cable HDMI' },
    // Agrega más responsables si es necesario
  ];

  const filteredResponsables = responsables.filter((responsable) =>
    responsable.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsable.articulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResponsables.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredResponsables.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    // Redirige a la ruta especificada en index.js
    navigate("/devoluciones/articleSelect");
  };

  return (

    <>
        {/* Sección de selección de responsable */}
        <div className='flex flex-col w-full p-5 bg-gray-100'>
          {/* Encabezado de selección de responsable */}
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md mb-4">
            Selección de responsable
          </div>
          <div className="bg-white shadow-md p-4 rounded-b-md mb-6">
            <p className="text-gray-700 mb-2">Estos son los Responsables actuales del sistema.</p>
            <p className="text-sm text-gray-500 mb-4">Seleccione el responsable al que desea asignar un artículo.</p>

            {/* Campo de búsqueda */}
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Buscar"
                className="px-2 py-1 border rounded-l-md w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="bg-gray-200 p-2 rounded-r-md">
                {/* <FaSearch className="text-gray-500" /> */}
              </div>
            </div>

            {/* Tabla de responsables */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-red-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Token</th>
                    <th className="text-left py-3 px-4 font-semibold">Articulo</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((responsable) => (
                    <tr className="border-t" key={responsable.id}>
                      <td className="py-3 px-4 text-sm">{responsable.token}</td>
                      <td className="py-3 px-4 text-sm">{responsable.articulo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
              <span className="text-gray-600">
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredResponsables.length)} de {filteredResponsables.length}
              </span>
              <div className="flex space-x-4 mt-2 sm:mt-0">
                <button 
                  onClick={() => handlePageChange("prev")} 
                  className={`text-gray-600 hover:text-gray-800 ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <button 
                  onClick={() => handlePageChange("next")} 
                  className={`text-gray-600 hover:text-gray-800 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Botón siguiente */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
            >
              Siguiente
            </button>
          </div>
        </div>
   

    </>
    
  );
};

export default ViewRestok_ArticleSelect;
