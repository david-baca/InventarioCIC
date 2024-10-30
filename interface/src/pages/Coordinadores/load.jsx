import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const ViewUserLoad = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
  });

  const [permissions, setPermissions] = useState({
    Articulo: { visualizacion: true, creacion: false, editar: false },
    Grupos: { visualizacion: true, creacion: false, editar: false },
    Responsable: { visualizacion: true, creacion: false, editar: false },
    Movimientos: { visualizacion: true, creacion: false, editar: false },
    Reporte: { visualizacion: true, creacion: false, editar: false },
    Historial: { visualizacion: true, creacion: false, editar: false },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePermissionChange = (category, type) => {
    setPermissions({
      ...permissions,
      [category]: {
        ...permissions[category],
        [type]: !permissions[category][type],
      },
    });
  };

  return (
    <>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full bg-red-800 text-white py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl">Bienvenido Fernando Castillo</h1>
        <button className="text-white">Cerrar Sesión</button>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Administración de Responsables</h2>
        <p className="text-gray-600 mb-6">Llena todos los campos para continuar</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold">Apellido Paterno</label>
            <input
              type="text"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold">Apellido Materno</label>
            <input
              type="text"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 text-gray-800"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Selecciona los permisos del administrador</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-red-800 rounded-md">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="py-2 px-4 border">Permiso</th>
                <th className="py-2 px-4 border">Visualización</th>
                <th className="py-2 px-4 border">Creación</th>
                <th className="py-2 px-4 border">Editar</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(permissions).map((category) => (
                <tr key={category} className="text-center border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border">{category}</td>
                  {['visualizacion', 'creacion', 'editar'].map((type) => (
                    <td key={type} className="py-2 px-4 border">
                      <input
                        type="checkbox"
                        checked={permissions[category][type]}
                        onChange={() => handlePermissionChange(category, type)}
                        className="accent-orange-500 w-5 h-5"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Cancelar
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Confirmar
          </button>
        </div>
      </main>
    </div>
    </>
  );
};
export default ViewUserLoad;