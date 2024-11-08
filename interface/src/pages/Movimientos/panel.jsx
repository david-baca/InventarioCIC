import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import imgAsignacion from "../../../public/img/asignacion.png";
import imgDebolucion from "../../../public/img/devolucion.png";
const ViewTransactions = () => {

  return (
     <>
     {/* Contenedor del encabezado y recuadro */}
     <div className="p-5 w-full">
          {/* Encabezado unido al recuadro */}
          <div className="bg-UP-Secundario text-white text-lg font-bold p-4 rounded-t-md">
            ¿Qué desea hacer hoy?
          </div>
          
          {/* Recuadro contenedor externo */}
          <div className="border border-gray-300 rounded-b-md p-5 bg-white shadow-md">
            <div className="flex flex-col lg:flex-row justify-center gap-4">
              
              {/* Primer recuadro interno */}
              <Link to="/asignaciones/responsibleSelect" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Asignaciones</h2>
                <img src={imgAsignacion} alt="Artículos" className="mt-4 mx-auto h-32 w-auto" />
              </Link>
              
              {/* Segundo recuadro interno */}
              <Link to="/devoluciones/responsibleSelect" className="flex-1 max-w-xs border rounded-md p-4 text-center hover:shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Devolución</h2>
                <img src={imgDebolucion} alt="Responsables" className="mt-4 mx-auto h-32 w-auto" />
              </Link>
            </div>
          </div>
        </div>
     </>
  );
};

export default ViewTransactions;