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
    const response = await instance.get(`/articulos//sin/res/${query}`);
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
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState({}); 
  const [error, setError] = useState(null);
  const peticiones = Peticion()

  // Cargar los artículos al cambiar la query
  useEffect(() => {
    const loadArticles = async () => {
      setError(null);
      try {
        const data = await peticiones.fetchArticles(query);
        setArticles(data.articulos);
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
     
        {articles.length > 0 ? (<>
          <Componentes.Table.table >
              <Componentes.Table.columna>
                <Componentes.Table.encabezado >
                  Token
                </Componentes.Table.encabezado>
                <Componentes.Table.encabezado >
                  Artículo
                </Componentes.Table.encabezado>
              </Componentes.Table.columna>
              {articles.map((article,index) => ((index <= limit.max && index >= limit.min) && (
                <tr
                  key={article.pk}
                  onClick={() => handleRowClick(article)}
                  className={`border-t border-gray-300 cursor-pointer ${
                    selectedArticle?.pk === article.pk ? 'bg-orange-500 text-white' : 'text-gray-600'
                  }`}
                >
                  <Componentes.Table.fila>
                    {article.no_inventario}
                  </Componentes.Table.fila>
                  <Componentes.Table.fila >
                    {article.nombre}
                  </Componentes.Table.fila>
                </tr>
              )))}
            </Componentes.Table.table>
            <Componentes.Inputs.Paginacion data={articles} handleLimit={(value)=>setLimit(value)}/>
          </>
        ) : (
          <h1 className="text-gray-500">No hay datos disponibles</h1>
        )}
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
