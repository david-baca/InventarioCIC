import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaFileExcel, FaArrowLeft } from 'react-icons/fa';
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

// Componente principal de la vista de reporte de artículo
const ViewReportArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const articleRecords = [
    { id: 1, entregadoPor: 'Juan Pérez', responsable: 'Ana Gómez', fecha: '2023-08-01', accion: 'Usado', motivo: 'N/A' },
    { id: 2, entregadoPor: 'María García', responsable: 'Carlos Ruiz', fecha: '2023-08-15', accion: 'Devuelto', motivo: 'Batería defectuosa' },
    { id: 3, entregadoPor: 'Carlos Rodríguez', responsable: 'Ana Gómez', fecha: '2023-08-15', accion: 'Usado', motivo: 'N/A' },
  ];

  return (
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

        {/* Sección de reporte de artículo */}
        <div className='flex flex-col w-full p-5 bg-gray-100'>
          {/* Encabezado del reporte */}
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md mb-4">
            Reporte de artículo
          </div>
          <div className="bg-white shadow-md p-4 rounded-b-md mb-6">
            <p className="text-gray-700 mb-2">Este es el registro del artículo.</p>
            <p className="text-sm text-gray-500 mb-4">Usos y devoluciones del artículo.</p>

            {/* Botón de descarga de artículo */}
            <button 
              onClick={() => alert("Descargar reporte de artículo")}
              className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 mb-4"
            >
              <FaFileExcel className="mr-2" />
              Descargar artículo
            </button>

            {/* Tabla de registros del artículo */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-red-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Entregado por</th>
                    <th className="text-left py-3 px-4 font-semibold">Responsable</th>
                    <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold">Acción</th>
                    <th className="text-left py-3 px-4 font-semibold">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {articleRecords.map((record) => (
                    <tr className="border-t" key={record.id}>
                      <td className="py-3 px-4 text-sm">{record.entregadoPor}</td>
                      <td className="py-3 px-4 text-sm">{record.responsable}</td>
                      <td className="py-3 px-4 text-sm">{record.fecha}</td>
                      <td className="py-3 px-4 text-sm">{record.accion}</td>
                      <td className="py-3 px-4 text-sm">{record.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botón de regresar */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600"
            >
              <FaArrowLeft className="mr-2" />
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportArticle;
