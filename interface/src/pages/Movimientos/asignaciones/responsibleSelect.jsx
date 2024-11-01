import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
// import logo from "../../public/upqroo.svg";

// Opciones del menú lateral
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

// Componente de opciones de navegación
const OptionNav = ({ name, isSelected }) => (
  <div className={`w-[100%] p-2 flex flex-row justify-start items-center 
    gap-1 border-[0.5px] border-UP-Opaco border-s-[1rem] rounded-e-md
    ${isSelected ? 'border-s-UP-Primario' :'border-s-UP-Gris'}`}>
    <div className='ps-2 p-1 border border-UP-Opaco rounded-e-md'>
      {isSelected ? <h1>●</h1> : <h1>○</h1>}
    </div>
    <h1>{name}</h1>
  </div>
);

// Componente principal de selección de responsable
const ViewAssigned_ResponsibleSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const responsables = [
    { id: 1, correo: 'David Stephen', usuario: 'Baca' },
    { id: 2, correo: 'Ana', usuario: 'Sanchez' },
    { id: 3, correo: 'Sonia Fernanda', usuario: 'Estroza' },
    // Agrega más responsables si es necesario
  ];

  const filteredResponsables = responsables.filter((responsable) =>
    responsable.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsable.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleNext = () => {
    // Redirige a la ruta especificada en index.js
    navigate("/asignaciones/responsibleSelect");
  };

  return (

    <>
    
    <div className='flex flex-row min-h-[100vh] max-h-[100vh] min-w-[100vw] max-w-[100vw] overflow-scroll'>
      {/* Menú lateral */}
      <div className="min-h-[100%] max-h-[100%] min-w-[15%] max-w-[15%] overflow-scroll flex-col inline-flex bg-UP-Gris">
        <div className="flex min-w-[100%] max-w-[100%] max-h-[6%] min-h-[6%] overflow-hidden">
          {/* <img src={logo} className="w-[100%]" alt="Logo UPQROO" /> */}
        </div>
        <div className="py-5 flex flex-col gap-2.5 w-[100%]">
          <div className="text-UP-Negro">Apartados</div>
          {options.map(({ name, path }) => (
            <Link key={name} to={path}>
              <OptionNav name={name} isSelected={location.pathname === path} />
            </Link>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className='flex flex-col w-[100%]'>
        {/* Encabezado de bienvenida */}
        <div className='bg-UP-Secundario text-UP-Blanco p-5'>
          <h1 className='font-semibold font-montserrat'>
            Bienvenido Fernando Castillo
          </h1>
        </div>

        {/* Sección de selección de responsable */}
        <div className='flex flex-col w-full p-5 bg-gray-100'>
          {/* Encabezado de selección de responsable */}
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md mb-4">
            Selección de responsable
          </div>
          <div className="bg-white shadow-md p-4 rounded-b-md mb-6">
            <p className="text-gray-700 mb-2">Estos son los Responsables actuales del sistema.</p>
            <p className="text-sm text-gray-500 mb-4">Seleccione el responsable al que desea asignar un artículo.</p>

            {/* Campo de búsqueda */}
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Buscar"
                className="px-2 py-1 border rounded-l-md w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="bg-gray-200 p-2 rounded-r-md">
                <FaSearch className="text-gray-500" />
              </div>
            </div>

            {/* Tabla de responsables */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-red-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Correos</th>
                    <th className="text-left py-3 px-4 font-semibold">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((responsable) => (
                    <tr className="border-t" key={responsable.id}>
                      <td className="py-3 px-4 text-sm">{responsable.correo}</td>
                      <td className="py-3 px-4 text-sm">{responsable.usuario}</td>
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

          {/* Botón siguiente */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
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

export default ViewAssigned_ResponsibleSelect;
