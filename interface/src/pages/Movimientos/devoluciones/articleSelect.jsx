import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente principal de selección de artículos
const ViewRestok_ArticleSelect = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [selectedArticle, setSelectedArticle] = useState(null); // Estado para la fila seleccionada

  const articles = [
    { id: 1, token: 'UPQROO-22056', articulo: 'Monitor' },
    { id: 2, token: 'UPQROO-21056', articulo: 'Teclado' },
    { id: 3, token: 'UPQROO-22083', articulo: 'Cable HDMI' },
    // Agrega más artículos si es necesario
  ];

  const filteredArticles = articles.filter((article) =>
    article.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.articulo.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleRowClick = (article) => {
    setSelectedArticle(article); // Actualizamos el artículo seleccionado
  };

  const handleNext = () => {
    if (selectedArticle) {
      // Redirige a la ruta especificada para el artículo seleccionado
      navigate(`/devoluciones/articleSelect/${selectedArticle.id}`);
    } else {
      alert("Por favor, selecciona un artículo antes de continuar.");
    }
  };

  return (
    <>
      {/* Sección de selección de artículo */}
      <div className="flex flex-col w-full p-5 bg-gray-100">
        {/* Encabezado de selección de artículo */}
        <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md mb-4">
          Selección de artículo
        </div>
        <div className="bg-white shadow-md p-4 rounded-b-md mb-6">
          <p className="text-gray-700 mb-2">Estos son los artículos disponibles en el sistema.</p>
          <p className="text-sm text-gray-500 mb-4">Seleccione el artículo que desea asignar.</p>

          {/* Campo de búsqueda */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar"
                className="px-2 py-1 border rounded-md w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de artículos */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-red-800 text-white">
                  <th className="text-left py-3 px-4 font-semibold">Token</th>
                  <th className="text-left py-3 px-4 font-semibold">Articulo</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((article) => (
                  <tr
                    className={`border-t cursor-pointer ${
                      selectedArticle?.id === article.id ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'
                    }`}
                    key={article.id}
                    onClick={() => handleRowClick(article)}
                  >
                    <td className="py-3 px-4 text-sm">{article.token}</td>
                    <td className="py-3 px-4 text-sm">{article.articulo}</td>
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
                onClick={() => handlePageChange('prev')}
                className={`text-gray-600 hover:text-gray-800 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange('next')}
                className={`text-gray-600 hover:text-gray-800 ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Botón siguiente */}
        <div className="mt-6 w-full">
          <button
            onClick={handleNext}
            disabled={!selectedArticle} // Deshabilitar si no hay selección
            className={`w-full px-6 py-2 rounded-md shadow text-gray-700 ${
              selectedArticle
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-not-allowed'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewRestok_ArticleSelect;
