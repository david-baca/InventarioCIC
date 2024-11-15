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
const fetchResponsables = async (query = '') => {
  try {
    const endpoint = query ? `/responsables/search/${query}` : '/responsables/search';
    const response = await instance.get(endpoint);
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
  const [selectedResponsable, setSelectedResponsable] = useState(null); // Estado para el responsable seleccionado
  const itemsPerPage = 3;

  // Cargar los responsables al cambiar el término de búsqueda
  useEffect(() => {
    const loadResponsables = async () => {
      setError(null);
      try {
        const data = await fetchResponsables(searchTerm || '');
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
      console.log(currentPage);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para seleccionar y resaltar la fila, y actualizar la URL
  const handleRowClick = (responsable) => {
    setSelectedResponsable(responsable); // Guardar el responsable completo seleccionado

    // Guardar la información en localStorage
    localStorage.setItem('selectedResponsable', JSON.stringify(responsable));

    // Actualizar la URL con el nombre y token del responsable seleccionado
    const nombreCompleto = `${responsable.nombres} ${responsable.apellido_p} ${responsable.apellido_m}`;
    window.history.pushState({}, '', `http://localhost:3720/asignaciones/${responsable.pk}-${nombreCompleto}`);
  };

  // Función para manejar el clic en "Siguiente"
  const handleNext = () => {
    const selectedResponsable = localStorage.getItem('selectedResponsable');
    if (selectedResponsable) {
      // Pasar a la siguiente ruta con la información del responsable
      navigate("/asignaciones/articleSelect");
    } else {
      alert("Por favor, selecciona un responsable antes de continuar.");
    }
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
        <div className="bg-gray-900 flex flex-col flex-wrap">
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : currentItems.length > 0 ? (
            <Componentes.Table.table className="w-full">
              <thead>
                <Componentes.Table.columna>
                  <Componentes.Table.encabezado className="bg-red-800 text-white text-center py-2">
                    Nombres
                  </Componentes.Table.encabezado>
                  <Componentes.Table.encabezado className="bg-red-800 text-white text-center py-2">
                    Apellidos
                  </Componentes.Table.encabezado>
                </Componentes.Table.columna>
              </thead>
              <tbody>
                {currentItems.map((responsable) => (
                  <tr
                    key={responsable.pk}
                    onClick={() => handleRowClick(responsable)}
                    className={`border-t border-gray-300 cursor-pointer ${
                      selectedResponsable?.pk === responsable.pk ? 'bg-orange-300' : ''
                    }`}
                  >
                    <Componentes.Table.fila className="text-center py-2 text-gray-600">
                      {responsable.nombres}
                    </Componentes.Table.fila>
                    <Componentes.Table.fila className="text-center py-2 text-gray-600">
                      {responsable.apellido_p} {responsable.apellido_m}
                    </Componentes.Table.fila>
                  </tr>
                ))}
              </tbody>
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
