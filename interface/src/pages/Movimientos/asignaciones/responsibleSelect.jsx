import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../../components";
import axios from 'axios';

// Configuración de instancia de axios
const baseApi = import.meta.env.VITE_BASE_API;
const instance = axios.create({
  baseURL: baseApi,
});

// Función para obtener los responsables desde la API
const fetchResponsables = async (query) => {
  try {
    const response = await instance.get(`/responsables/search/${query}`);
    return response.data;
  } catch (error) {
    console.error("Error al buscar responsables:", error);
    return [];
  }
};

const ViewAssigned_ResponsibleSelect = () => {
  const navigate = useNavigate();
  const [responsables, setResponsables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Cargar los responsables al cambiar el término de búsqueda
  useEffect(() => {
    const loadResponsables = async () => {
      setError(null);
      try {
        const data = await fetchResponsables(searchTerm || ''); // Enviar vacío si no hay query
        setResponsables(data);
      } catch (err) {
        setError("No se pudieron cargar los responsables.");
      }
    };
    loadResponsables();
  }, [searchTerm]);

  // Función para manejar el cambio de búsqueda
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = responsables.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(responsables.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    navigate("/devoluciones/responsibleSelect");
  };

  return (
    <>
      <Componentes.Inputs.TitleHeader text={"Selección de responsable"} />
      <div className="p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Componentes.Inputs.TitleSubtitle 
              titulo={"Estos son los Responsables actuales del sistema."} 
              contenido={"Seleccione el responsable al que desea asignar un artículo."} 
            />
          </div>
          <div className="w-1/3">
            <Componentes.Buscador 
              query={searchTerm} 
              OnChange={handleSearchChange} 
              className="border border-gray-300 rounded-full px-3 py-2 w-full" 
            />
          </div>
        </div>

        {/* Tabla de responsables */}
        <div className="bg-gray-100 rounded-lg shadow-md p-4">
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : currentItems.length > 0 ? (
            <Componentes.Table.table className="w-full">
              <Componentes.Table.columna>
                <Componentes.Table.encabezado className="bg-red-800 text-white text-center py-2">
                  Correos
                </Componentes.Table.encabezado>
                <Componentes.Table.encabezado className="bg-red-800 text-white text-center py-2">
                  Usuario
                </Componentes.Table.encabezado>
              </Componentes.Table.columna>
              {currentItems.map((responsable) => (
                <Componentes.Table.columna key={responsable.id} className="border-t border-gray-300">
                  <Componentes.Table.fila className="text-center py-2 text-gray-600">
                    {responsable.correo}
                  </Componentes.Table.fila>
                  <Componentes.Table.fila className="text-center py-2 text-gray-600">
                    {responsable.usuario}
                  </Componentes.Table.fila>
                </Componentes.Table.columna>
              ))}
            </Componentes.Table.table>
          ) : (
            <h1 className="text-gray-500 text-center">No hay datos disponibles</h1>
          )}
        </div>

        {/* Paginación */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
          <span className="text-gray-600">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, responsables.length)} de {responsables.length}
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
        <div className="flex justify-center mt-4">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewAssigned_ResponsibleSelect;
