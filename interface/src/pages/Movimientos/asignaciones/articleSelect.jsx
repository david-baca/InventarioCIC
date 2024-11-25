import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../../components";
import axios from 'axios';

const Peticion =()=>{
const baseApi = import.meta.env.VITE_BASE_API;
const instance = axios.create({
  baseURL: baseApi,
});
// Función para obtener los artículos desde la API
const fetchArticles = async (query) => {
  try {
    const response = await instance.get(`/articulos/search/${query}`);
    console.log("Artículos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al buscar artículos:", error);
    return [];
  }
};
return {fetchArticles}
}
const ArticleSelect = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null); // Estado para el artículo seleccionado
  const itemsPerPage = 3;
  const peticiones = Peticion()

  // Cargar los artículos al cambiar la query
  useEffect(() => {
    const loadArticles = async () => {
      setError(null);
      try {
        const data = await peticiones.fetchArticles(query);
        setArticles(data);
      } catch (err) {
        setError("No se pudieron cargar los artículos.");
      }
    };
    loadArticles();
  }, [query]);

  // Función para manejar el cambio de búsqueda
  const handleSearchChange = (value) => {
    setQuery(value);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para seleccionar y resaltar la fila
  const handleRowClick = (article) => {
    setSelectedArticle(article)
  };

  // Función para manejar el clic en "Siguiente"
  const handleNext = () => {
    if (selectedArticle) {
      navigate("./"+encodeURIComponent(selectedArticle.no_inventario));
    }else{
      alert("Por favor, selecciona un articulo antes de continuar. ");
    }
  };

  return (
    <>
      <Componentes.Inputs.TitleHeader text={"Selección de artículo - (asignación)"} />
      <div className="p-4 rounded-b-md mb-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center w-full">
            <Componentes.Inputs.TitleSubtitle
              titulo={"Estos son los Artículos del inventario."}
              contenido={"Busque por token o nombre del artículo"}
            />
          </div>
          <div className="w-1/3">
            <Componentes.Buscador
              query={query}
              OnChange={handleSearchChange}
              className="border border-gray-300 rounded-full px-3 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Tabla de artículos */}
      <div className="bg-gray-900 flex flex-col flex-wrap">
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : currentItems.length > 0 ? (
          <Componentes.Table.table className="w-full border border-gray-300">
            <thead>
              <Componentes.Table.columna>
                <Componentes.Table.encabezado className="bg-red-800 text-white text-center py-2">
                  Token
                </Componentes.Table.encabezado>
                <Componentes.Table.encabezado className="bg-red-800 text-white text-center py-2">
                  Artículo
                </Componentes.Table.encabezado>
              </Componentes.Table.columna>
            </thead>
            <tbody>
              {currentItems.map((article) => (
                <tr
                  key={article.pk}
                  onClick={() => handleRowClick(article)}
                  className={`border-t border-gray-300 cursor-pointer ${
                    selectedArticle?.pk === article.pk ? 'bg-orange-500 text-white' : 'text-gray-600'
                  }`}
                >
                  <Componentes.Table.fila className="text-center py-2">
                    {article.no_inventario}
                  </Componentes.Table.fila>
                  <Componentes.Table.fila className="text-center py-2">
                    {article.nombre}
                  </Componentes.Table.fila>
                </tr>
              ))}
            </tbody>
          </Componentes.Table.table>
        ) : (
          <h1 className="text-gray-500">No hay datos disponibles</h1>
        )}
      </div>

      {/* Paginación */}
      <div className="p-4 rounded-b-md mb-0 flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
        <span className="text-gray-600">
          Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, articles.length)} de {articles.length}
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

      {/* Botón siguiente */}
      <div className="mb-0 mt-1 flex justify-center">
        <button
          onClick={handleNext}
          disabled={!selectedArticle} // Deshabilitar si no hay selección
          className={`w-full px-6 py-2 rounded-md shadow ${
            selectedArticle
              ? "bg-orange-500 border-orange-500 text-white hover:bg-orange-600"
              : "bg-white border-gray-300 text-gray-600"
          } border`}
        >
          Siguiente
        </button>
      </div>
    </>
  );
};

export default ArticleSelect;
