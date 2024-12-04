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

// Función para obtener los artículos asignados a los responsables
const fetchArticlesByResponsible = async (responsibleId) => {
  try {
    const response = await instance.get(`/responsables/${responsibleId}/articulos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener artículos del responsable:", error);
    throw new Error("No se pudieron cargar los artículos asignados.");
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

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Responsables");

      // Definir encabezados
      worksheet.columns = [
        { header: "ID", key: "id" },
        { header: "Nombre", key: "nombre" },
        { header: "Correo", key: "correo" },
        { header: "Artículos Asignados", key: "articulos" },
        { header: "Valor Total", key: "valor_total" },
      ];

      // Obtener los datos de los responsables con los artículos asignados
      for (const responsible of responsibles) {
        const articles = await fetchArticlesByResponsible(responsible.pk);
        const totalValue = articles.reduce((acc, article) => acc + article.valor, 0);

        worksheet.addRow({
          id: responsible.pk,
          nombre: `${responsible.nombres} ${responsible.apellido_p} ${responsible.apellido_m}`,
          correo: responsible.correo || "No disponible",
          articulos: articles.map(article => article.nombre).join(", ") || "No asignados",
          valor_total: totalValue.toFixed(2) || "0.00",
        });
      }

      // Crear el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `responsables_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(new Blob([buffer]), fileName);
    } catch (error) {
      console.error('Error al generar el archivo Excel:', error);
      alert('No se pudo descargar el archivo.');
    }
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

      {/* Descargar responsables como Excel */}
      <div className="flex items-center justify-center w-full px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700 mb-4">
        <button
          onClick={handleDownloadExcel}
          className="w-full flex items-center justify-center px-3 py-1 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
        >
          Descargar responsables
        </button>
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
                <th className="text-left py-3 px-4 font-semibold">Correo</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((responsible) => (
                <tr className="border-t" key={responsible.pk}>
                  <td className="py-3 px-4 text-sm">
                    {`${responsible.nombres} ${responsible.apellido_p} ${responsible.apellido_m}`}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {responsible.correo || "No disponible"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="mt-4 flex justify-between items-center">
            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1} className="btn-paginacion">Anterior</button>
            <span>{`Página ${currentPage} de ${totalPages}`}</span>
            <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages} className="btn-paginacion">Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReportResponsibles;
