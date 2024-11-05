import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const ViewUser = () => {
  return (
    <>
        <h1>panel de Coordinadores</h1>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full bg-red-800 text-white py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl">Bienvenido Fernando Castillo</h1>
        <button className="text-white">Cerrar Sesión</button>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
        <h2 className="text-2xl font-bold text-red-800 mb-2">Administración de permisos</h2>
        <p className="text-gray-600 mb-4">Estos son los permisos del Inventario. Los cambios se hacen en tiempo real.</p>

        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
          + Crear Administrador
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-red-800 rounded-md">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="py-2 px-4 border">Correos</th>
                <th className="py-2 px-4 border">Usuarios</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Permisos</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center border-b hover:bg-gray-100">
                <td className="py-2 px-4 border">user@upqroo.edu.mx</td>
                <td className="py-2 px-4 border">David Baca</td>
                <td className="py-2 px-4 border text-green-600">Activo</td>
                <td className="py-2 px-4 border">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 rounded">
                    Editar
                  </button>
                </td>
              </tr>
              {/* Repite la fila para más usuarios */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
    </>
  );
};
export default ViewUser;