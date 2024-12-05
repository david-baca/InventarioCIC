import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Componentes from "../../components";
import axios from "axios";

// Configuración de instancia de axios
const baseApi = import.meta.env.VITE_BASE_API;
const instance = axios.create({
  baseURL: baseApi,
});

// Función para obtener los responsables con sus datos
const fetchResponsibles = async (query = "") => {
  try {
    const endpoint = query ? `/responsables/search/${query}` : "/responsables/search/";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al buscar responsables:", error);
    throw new Error("No se pudieron cargar los responsables.");
  }
};

const ViewReportResponsibles = () => {
  const navigate = useNavigate();
  const [responsibles, setResponsibles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Cargar los responsables al montar el componente o cambiar la búsqueda
  useEffect(() => {
    const loadResponsibles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchResponsibles(searchTerm);
        setResponsibles(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los responsables.");
      } finally {
        setLoading(false);
      }
    };
    loadResponsibles();
  }, [searchTerm]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = responsibles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(responsibles.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Redirigir a la ruta del reporte del responsable
  const handleRedirect = (id) => {
    navigate(`/reportes/responsable/${id}`);
  };

  return (
    <div className="p-4">
      <Componentes.Inputs.TitleHeader text={"Reportes de responsables"} />

      {/* Buscador */}
      <div className="flex justify-between items-center mb-4">
        <Componentes.Inputs.TitleSubtitle
          titulo={"Responsables actuales del sistema."}
          contenido={"Seleccione un responsable para ver su reporte detallado."}
        />
        <div className="w-1/3">
          <Componentes.Buscador
            query={searchTerm}
            OnChange={(value) => setSearchTerm(value)}
            className="border border-gray-300 rounded-full px-3 py-2 w-full"
          />
        </div>
      </div>

      {/* Mostrar errores o carga */}
      {loading && <p className="text-gray-600">Cargando responsables...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Tabla de responsables */}
      {!loading && !error && currentItems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="text-left py-3 px-4 font-semibold">Nombre Completo</th>
                <th className="text-left py-3 px-4 font-semibold">Cantidad de Artículos</th>
                <th className="text-left py-3 px-4 font-semibold">Valor Total</th>
                <th className="text-left py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((responsible) => {
                const valorTotal = responsible.Articulos?.reduce((total, articulo) => {
                  const costo = parseFloat(articulo.costo);
                  return total + (isNaN(costo) ? 0 : costo);
                }, 0) || 0;

                return (
                  <tr className="border-t" key={responsible.pk}>
                    <td className="py-3 px-4 text-sm">
                      {`${responsible.nombres} ${responsible.apellido_p} ${responsible.apellido_m}`}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {responsible.Articulos?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      ${valorTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleRedirect(responsible.pk)}
                        className="text-orange-500 hover:text-orange-600"
                        title="Ver reporte del responsable"
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
          Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, responsibles.length)} de {responsibles.length}
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

export default ViewReportResponsibles;
