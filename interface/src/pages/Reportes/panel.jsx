import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import imgArticulos from "../../../public/articulos.svg";
import imgResponsables from "../../../public/responsables.svg";
const ViewReport = () => {
  const location = useLocation();

  return (
    <>
      {/* Contenedor del encabezado y recuadro */}
      <div className="p-5 w-full">
          {/* Encabezado unido al recuadro */}
          <div className="bg-red-800 text-white text-lg font-bold p-4 rounded-t-md">
            ¿Qué informe deseas sacar?
          </div>
          {/* Recuadro contenedor externo */}
          <div className="border border-gray-300 rounded-b-md p-5 bg-white shadow-md">
            <div className="flex flex-col lg:flex-row justify-center gap-4">
              
              {/* Primer recuadro interno */}
              <Link to="/Reportes/articulos" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-justify font-semibold mb-2">Artículos</h2>
                <p className="text-justify">Daños y Asignaciones.</p>
                <img src={imgArticulos} alt="Artículos" className="mt-4 mx-auto h-auto w-auto" />
              </Link>
              
              {/* Segundo recuadro interno */}
              <Link to="/Reportes/responsables" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <img src={imgResponsables} alt="Responsables" className="mt-4 mx-auto h-auto w-auto" />
                <h2 className="text-justify font-semibold mb-2">Responsables</h2>
                <p className="text-justify">Asignaciones actuales.</p>
              </Link>
            </div>
          </div>
        </div>
    </>
  );
};

export default ViewReport;
