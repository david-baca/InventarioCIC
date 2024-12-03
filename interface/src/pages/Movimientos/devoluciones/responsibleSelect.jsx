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

const ViewRestok_ResponsibleSelect = () => {
  const navigate = useNavigate();
  const [responsables, setResponsables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResponsable, setSelectedResponsable] = useState(null); // Estado para la fila seleccionada
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

  // Filtrar responsables según la búsqueda
  const filteredResponsables = responsables.filter((responsable) =>
    responsable.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsable.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsable.apellido_p.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsable.apellido_m.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
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

  // Función para seleccionar la fila
  const handleRowClick = (responsable) => {
    setSelectedResponsable(responsable);
  };

  // Función para manejar el clic en "Siguiente"
  const handleNext = () => {
    if (selectedResponsable) {
      // Actualizamos la URL con el ID del responsable seleccionado
      navigate(`/devoluciones/${selectedResponsable.pk}`);
    } else {
      alert("Por favor, selecciona un responsable antes de continuar.");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full p-5 bg-gray-100">
        {/* Encabezado de selección de responsable */}
        <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md mb-4">
          Selección de responsable
        </div>
        <div className="bg-white shadow-md p-4 rounded-b-md mb-6">
          {/* Contenedor de texto y buscador en la parte superior derecha */}
          <div className="flex justify-between items-center mb-4">
            {/* Texto a la izquierda */}
            <div className="flex-1">
              <p className="text-gray-700">Estos son los Responsables actuales del sistema.</p>
              <p className="text-sm text-gray-500">Seleccione el responsable al que desea asignar un artículo.</p>
            </div>

            {/* Buscador a la derecha */}
            <div className="ml-4">
              <input
                type="text"
                placeholder="Buscar"
                className="px-2 py-1 border rounded-md w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de responsables */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-red-800 text-white">
                  <th className="text-left py-3 px-4 font-semibold">Correo</th>
                  <th className="text-left py-3 px-4 font-semibold">Nombre Completo</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((responsable) => (
                  <tr
                    className={`border-t cursor-pointer ${
                      selectedResponsable?.pk === responsable.pk ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'
                    }`}
                    key={responsable.pk}
                    onClick={() => handleRowClick(responsable)}
                  >
                    <td className="py-3 px-4 text-sm">{responsable.correo}</td>
                    <td className="py-3 px-4 text-sm">{`${responsable.nombres} ${responsable.apellido_p} ${responsable.apellido_m}`}</td>
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

        {/* Botón siguiente que abarca todo el ancho */}
        <div className="mt-6 w-full">
          <button 
            onClick={handleNext}
            disabled={!selectedResponsable} // Deshabilitar si no hay selección
            className={`w-full px-6 py-2 rounded-md shadow text-gray-700 ${
              selectedResponsable 
                ? "bg-orange-500 text-white hover:bg-orange-600" // Botón con responsable seleccionado
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-not-allowed" // Botón sin selección
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewRestok_ResponsibleSelect;
