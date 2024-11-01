import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, } from 'react-router-dom';
// import { FaFileExcel } from 'react-icons/fa'; // Icono de Excel

const ViewHistory = ({ children }) => {
  const location = useLocation();
  const [data, setData] = useState([
    { fecha: "30/9/2024 15:45", usuario: "Fernando Castillo", accion: "Crear Reporte", descripcion: "El (Rol) (Nombre usuario) creo (Nombre de la acción)" },
    { fecha: "30/9/2024 12:45", usuario: "Fernando Castillo", accion: "Añadió responsable", descripcion: "El (Rol) (Nombre usuario) (Nombre de la acción) a (Nombre del responsable)" },
    { fecha: "27/9/2024 11:12", usuario: "Fernando Castillo", accion: "Añadió Articulo", descripcion: "El (Rol) (Nombre usuario) (Nombre de la acción) el artículo (Nombre del artículo)" },
    { fecha: "27/9/2024 11:12", usuario: "Gonzalez Guzman", accion: "Elimino Articulo", descripcion: "El (Rol) (Nombre usuario) (Nombre de la acción) el artículo (Nombre del artículo)" },
    { fecha: "27/9/2024 11:12", usuario: "Cristian Adamir", accion: "Asigno Articulo", descripcion: "El (Rol) (Nombre usuario) (Nombre de la acción) el artículo (Nombre del artículo)" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("Todas");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterAction(event.target.value);
  };

  const handleDownload = () => {
    alert("Descargar reporte en Excel");
  };

  const filteredData = data
    .filter(item => 
      item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAction === "Todas" || item.accion.includes(filterAction))
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
        <>
        {/* Sección de Administración de Historial */}
        <div className='p-5 w-full bg-gray-100 rounded-md'>
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md">
            Administración de Historial
          </div>
          <div className="bg-white shadow-md p-4 rounded-b-md">
            <p className="text-gray-700 mb-4">Estos son las actividades que han realizado en el Inventario.</p>
            <p className="text-sm text-gray-500 mb-6">Los cambios se hacen en tiempo real.</p>
            
            <button 
              onClick={handleDownload} 
              className="flex items-center mb-4 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
            >
              {/* <FaFileExcel className="mr-2" /> */}
              Descargar reporte completo
            </button>
            
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre"
                className="px-4 py-2 w-full sm:w-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                value={searchTerm}
                onChange={handleSearch}
              />
              <select 
                className="px-4 py-2 w-full sm:w-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400" 
                value={filterAction}
                onChange={handleFilterChange}
              >
                <option value="Todas">Todas las acciones</option>
                <option value="Añadio">Añadio</option>
                <option value="Creo">Creo</option>
                <option value="Elimino">Elimino</option>
                <option value="Asigno">Asigno</option>
              </select>
            </div>

            {/* Tabla de historial */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-red-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold">Acción</th>
                    <th className="text-left py-3 px-4 font-semibold">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr className="border-t" key={index}>
                      <td className="py-3 px-4 text-sm">{item.fecha}</td>
                      <td className="py-3 px-4 text-sm">{item.usuario}</td>
                      <td className="py-3 px-4 text-sm">{item.accion}</td>
                      <td className="py-3 px-4 text-sm">{item.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
              <span className="text-gray-600">
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length}
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
        </div>
        </>
  );
};

export default ViewHistory;
