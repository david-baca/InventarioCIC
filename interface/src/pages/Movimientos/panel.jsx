import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from "/upqroo.svg";

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
  <div className={`w-full p-2 flex items-center gap-1 border-[0.5px] border-UP-Opaco border-s-[1rem] rounded-e-md
    ${isSelected ? 'border-s-UP-Primario' :'border-s-UP-Gris'}`}>
    <div className='ps-2 p-1 border border-UP-Opaco rounded-e-md'>
      {isSelected ? <h1>●</h1> : <h1>○</h1>}
    </div>
    <h1 className="text-sm md:text-base">{name}</h1>
  </div>
);

const ViewTransactions = () => {
  const location = useLocation();

  return (
    <div className='flex flex-row min-h-[100vh] max-h-[100vh] min-w-[100vw] max-w-[100vw] overflow-scroll'>
      {/* Menú lateral */}
      <div className="min-h-[100%] max-h-[100%] min-w-[15%] max-w-[15%] bg-UP-Gris flex flex-col overflow-scroll">
        <div className="flex min-w-[100%] max-w-[100%] max-h-[6%] min-h-[6%] overflow-hidden">
          <img src={logo} className="w-full" alt="Logo UPQROO" />
        </div>
        <div className="py-5 flex flex-col gap-2.5 w-full">
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
        <div className='bg-UP-Secundario text-UP-Blanco p-5'>
          <h1 className='font-semibold font-montserrat'>
            Bienvenido Fernando Castillo
          </h1>
        </div>
        
        {/* Contenedor del encabezado y recuadro */}
        <div className="p-5 w-full">
          {/* Encabezado unido al recuadro */}
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md">
            ¿Qué desea hacer hoy?
          </div>
          
          {/* Recuadro contenedor externo */}
          <div className="border border-gray-300 rounded-b-md p-5 bg-white shadow-md">
            <div className="flex flex-col lg:flex-row justify-center gap-4">
              
              {/* Primer recuadro interno */}
              <Link to="/Movimientos/asignaciones/responsibleSelect" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Asignaciones</h2>
                <img src="interface\public\asignacion.png" alt="Artículos" className="mt-4 mx-auto h-32 w-auto" />
              </Link>
              
              {/* Segundo recuadro interno */}
              <Link to="/Movimientos/devoluciones/responsibleSelect" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Devolución</h2>
                <img src="interface\public\devolucion.png" alt="Responsables" className="mt-4 mx-auto h-32 w-auto" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactions;
