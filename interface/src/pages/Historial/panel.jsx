import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaFileExcel } from 'react-icons/fa'; // Icono de Excel
import { useNavigate } from 'react-router-dom';

const options = [
  { name: "Inicio", path: "/" },
  { name: "Artículos", path: "/articles" },
  { name: "Grupos", path: "/groups" },
  { name: "Almacén", path: "/almacen" },
  { name: "Responsable", path: "/responsable" },
  { name: "Movimientos", path: "/movimientos" },
  { name: "Reportes", path: "/reportes" },
  { name: "Historial", path: "/historial" },
  { name: "Coordinadores", path: "/coordinadores" },
];

const OptionNav = ({ name, isSelected }) => (
  <div className={`w-full p-2 flex items-center gap-1 border-[0.5px] border-UP-Opaco rounded-e-md
    ${isSelected ? 'border-s-UP-Primario' :'border-s-UP-Gris'}`}>
    <div className='ps-2 p-1 border border-UP-Opaco rounded-e-md'>
      {isSelected ? <h1>●</h1> : <h1>○</h1>}
    </div>
    <h1 className="text-sm md:text-base">{name}</h1>
  </div>
);

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
    <div className='flex flex-col lg:flex-row min-h-screen'>
      {/* Barra lateral de navegación */}
      <div className="w-full lg:w-1/5 bg-UP-Gris overflow-y-auto">
        <div className="flex justify-center py-4">
          {/* Logo comentado */}
        </div>
        <div className="py-5 flex flex-col gap-2.5 w-full">
          <div className="text-UP-Negro text-center lg:text-left">Apartados</div>
          {options.map(({ name, path }) => (
            <Link key={name} to={path}>
              <OptionNav name={name} isSelected={location.pathname === path} />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className='flex flex-col w-full lg:w-4/5'>
        <div className='bg-UP-Secundario text-UP-Blanco p-5'>
          <h1 className='font-semibold font-montserrat text-center lg:text-left'>
            Bienvenido Fernando Castillo
          </h1>
        </div>
        
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
              <FaFileExcel className="mr-2" />
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
      </div>
    </div>
  );
};

export default ViewHistory;
