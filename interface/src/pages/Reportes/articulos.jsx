import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { FaFileExcel, FaArrowRight, FaArrowLeft, FaSearch } from 'react-icons/fa';

// Componente de menú con el contenido principal
const ViewReportArticles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const articles = [
    { id: 1, name: 'Laptop Dell XPS', cost: 10299.99 },
    { id: 2, name: 'Disco Duro Externo 1TB', cost: 790.99 },
    // Agrega más artículos si lo necesitas
  ];

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función de redirección a la ruta del artículo con ID
  const handleRedirect = (id) => {
    navigate(`/Reportes/articulo/${id}`);
  };

  return (
  <>
    {/* Sección de reporte de artículos */}
    <div className='flex flex-col w-full p-5 bg-gray-100'>
          {/* Encabezado del reporte */}
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md mb-4">
            Reportes de artículos
          </div>
          <div className="bg-white shadow-md p-4 rounded-b-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700">Estos son todos los artículos.</p>
              <div className="flex items-center border rounded-md px-2">
                <input
                  type="text"
                  placeholder="Buscar"
                  className="px-2 py-1 w-full border-none focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <FaSearch className="text-gray-500" /> */}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Selecciona alguno para ver su reporte</p>
            
            {/* Botón de descarga en línea completa */}
            <button 
              onClick={() => alert("Descargar reporte en Excel")}
              className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 mb-4"
            >
              {/* <FaFileExcel className="mr-2" /> */}
              Descargar reporte completo
            </button>

            {/* Tabla de artículos */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-red-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Artículo</th>
                    <th className="text-left py-3 px-4 font-semibold">Costo</th>
                    <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((article) => (
                    <tr className="border-t" key={article.id}>
                      <td className="py-3 px-4 text-sm">{article.name}</td>
                      <td className="py-3 px-4 text-sm">${article.cost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm">
                        <button 
                          onClick={() => handleRedirect(article.id)} 
                          className="text-orange-600 hover:text-orange-800"
                          title="Ver detalles del artículo"
                        >
                          {/* <FaArrowRight /> */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
              <span className="text-gray-600">
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredArticles.length)} de {filteredArticles.length}
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

          {/* Botón de regresar */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600"
            >
              {/* <FaArrowLeft className="mr-2" /> */}
              Regresar
            </button>
          </div>
        </div>
  </>

      
      
  );
};

export default ViewReportArticles;
