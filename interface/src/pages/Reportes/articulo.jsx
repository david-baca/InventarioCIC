import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { FaFileExcel, FaArrowLeft } from 'react-icons/fa';

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
    <>
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
              {/* <FaFileExcel className="mr-2" /> */}
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
              {/* <FaArrowLeft className="mr-2" /> */}
              Regresar
            </button>
          </div>
        </div>
    </>
  );
};

export default ViewReportArticle;
