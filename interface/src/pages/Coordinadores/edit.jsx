import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import Botones from '../components/botones';
//import { peticionUsuario } from './path_to_peticion_usuario';

export const peticionUsuario = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const obtenerUsuario = async (id) => {
    try {
      const response = await instance.get(`/usuarios/details/${id}`);
      return response.data.usuario; // Ajustar a la estructura de tu API
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al cargar el usuario');
    }
  };

  const actualizarUsuario = async (id, data) => {
    try {
      await instance.put(`/usuarios/${id}`, data);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar el usuario');
    }
  };

  return { obtenerUsuario, actualizarUsuario };
};

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [estado, setEstado] = useState(true);
  const [error, setError] = useState(null);

  const { obtenerUsuario, actualizarUsuario } = peticionUsuario();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerUsuario(id);
        setUsuario(data);
        setPermisos(data.permisos); // Asumimos que la API devuelve permisos en el usuario
        setEstado(data.estado);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarDatos();
  }, [id]);

  const handlePermisoChange = (index) => {
    setPermisos((prevPermisos) =>
      prevPermisos.map((permiso, idx) =>
        idx === index ? { ...permiso, activo: !permiso.activo } : permiso
      )
    );
  };

  const handleGuardar = async () => {
    try {
      await actualizarUsuario(id, { estado, permisos });
      navigate('/usuarios');
    } catch (err) {
      setError(err.message);
    }
  };
}


const ViewUserEdit = () => {
  return (
    <>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
        <h2 className="text-2xl font-bold text-UP-Secundario mb-4">Administración de Permisos</h2>
        <p className="text-UP-Opaco mb-6">Llena todos los campos para continuar</p>

        {/* "conetcado" con la api */}
        <div className="bg-gray-900 p-4 text-white">
      {error && <div className="text-red-600">{error}</div>}
      {usuario ? (
        <div>
          <h1 className="text-xl mb-4">Editar Usuario: {usuario.nombre}</h1>
          <div className="mb-4">
            <label className="block">Correo:</label>
            <input
              type="text"
              value={usuario.correo}
              readOnly
              className="bg-gray-800 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Estado:</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value === 'true')}
              className="bg-gray-800 p-2 rounded w-full"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <h2 className="text-lg mb-2">Permisos:</h2>
          <div className="mb-4">
            {permisos.map((permiso, index) => (
              <div key={permiso.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={permiso.activo}
                  onChange={() => handlePermisoChange(index)}
                  className="mr-2"
                />
                <label>{permiso.nombre}</label>
              </div>
            ))}
          </div>
          <button onClick={handleGuardar} className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar Cambios
          </button>
        </div>
      ) : (
        <div>Cargando datos...</div>
      )}
    </div>
{/* "conetcado" con la api */}





        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-UP-Opaco font-semibold">Nombre</label>
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
export default ViewUserEdit;