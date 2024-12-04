import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Componentes from "../../components";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Configuración de instancia de axios
const baseApi = import.meta.env.VITE_BASE_API;
const instance = axios.create({
  baseURL: baseApi,
});

// Función para obtener los artículos desde la API
const fetchArticles = async (query = "") => {
  try {
    const endpoint = query ? `/articulos/search/${query}` : "/articulos/search/";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al buscar artículos:", error);
    throw new Error("No se pudieron cargar los artículos.");
  }
};

const ViewReportArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Cargar los artículos al montar el componente o cambiar la búsqueda
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticles(searchTerm);
        setArticles(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los artículos.");
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [searchTerm]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Redirigir a la ruta del reporte del artículo
  const handleRedirect = (id) => {
    navigate(`/reportes/articulo/${id}`);
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('/articulos/exportar/excel', {
        method: 'GET',
      });
  
      if (!response.ok) throw new Error('Error al generar el archivo Excel');
  
      const blob = await response.blob();
      const fileName = `articulos_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
      alert('No se pudo descargar el archivo.');
    }
  };
  
  
  return (
    <div className="p-4">
      <Componentes.Inputs.TitleHeader text={"Reportes de artículos"} />

      {/* Buscador */}
      <div className="flex justify-between items-center mb-4">
        <Componentes.Inputs.TitleSubtitle
          titulo={"Estos son los artículos del inventario."}
          contenido={"Seleccione alguno para ver su reporte detallado."}
        />
        <div className="w-1/3">
          <Componentes.Buscador
            query={searchTerm}
            OnChange={(value) => setSearchTerm(value)}
            className="border border-gray-300 rounded-full px-3 py-2 w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-center w-full px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700 mb-4">
  <button
    onClick={handleDownloadExcel}
    className="w-full flex items-center justify-center px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
  >
    Descargar artículos
  </button>
</div>


      {/* Mostrar errores o carga */}
      {loading && <p className="text-gray-600">Cargando artículos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Tabla de artículos */}
      {!loading && !error && currentItems.length > 0 && (
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
  {currentItems.map((article) => {
    // Asegurar que el costo sea un número
    const costoNumerico = parseFloat(article.costo);

    return (
      <tr className="border-t" key={article.pk}>
        <td className="py-3 px-4 text-sm">{article.nombre}</td>
        <td className="py-3 px-4 text-sm">
          {!isNaN(costoNumerico) ? `$${costoNumerico.toFixed(2)}` : "N/A"}
        </td>
        <td className="py-3 px-4 text-sm">
          <button
            onClick={() => handleRedirect(article.pk)}
            className="text-orange-500 hover:text-orange-600"
            title="Ver reporte del artículo"
          >
            Ver reporte
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {!loading && !error && currentItems.length === 0 && (
        <p className="text-gray-500 text-center">No hay datos disponibles</p>
      )}

      {/* Paginación */}
      <div className="p-4 flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-600">
          Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, articles.length)} de {articles.length}
        </span>
        <div className="flex space-x-4">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-gray-600 border-gray-400 hover:text-gray-800 hover:border-gray-600"
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-gray-600 border-gray-400 hover:text-gray-800 hover:border-gray-600"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      <div className="mt-6">
  <button
    onClick={() => navigate(-1)}
    className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600"
  >
    <span className="mr-2">←</span> Regresar
  </button>
</div>

    </div>
  );
};

export default ViewReportArticles;
