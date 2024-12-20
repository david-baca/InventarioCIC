import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import articulosImg from "../../../public/img/asignacion.png"
import responsableImg from "../../../public/img/devolucion.png"
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
              <Link to="/reportes/articulos" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Artículos</h2>
                <p>Daños y Asignaciones.</p>
                <img src={articulosImg} alt="Artículos" className="mt-4 mx-auto h-32 w-auto" />
              </Link>
              
              {/* Segundo recuadro interno */}
              <Link to="/reportes/responsables" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Responsables</h2>
                <p>Asignaciones actuales.</p>
                <img src={responsableImg} alt="Responsables" className="mt-4 mx-auto h-32 w-auto" />
              </Link>
            </div>
          </div>
        </div>
    </>
  );
};

export default ViewReport;