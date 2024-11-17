import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Components from '../../components';
import axios from 'axios';

const peticionUsuarios = () => {
  const section = 'usuarios';
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const obtenerUsuario = async (id) => {
    try {
      const response = await instance.get(`/${section}/details/${id}`);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error('Error al obtener los datos del usuario');
    }
  };

  const actualizarUsuario = async (id, data) => {
    try {
      const response = await instance.put(`/${section}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error('Error al actualizar el usuario');
    }
  };

  return { obtenerUsuario, actualizarUsuario };
};

const ViewUserEdit = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [estado, setEstado] = useState(1);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { obtenerUsuario, actualizarUsuario } = peticionUsuarios();

  const permisosDisponibles = {
    Articulo: [1, 2, 3],
    Grupos: [4, 5, 6],
    Responsable: [7, 8, 9],
    Movimientos: [10, 11, 12],
    Reporte: [13, 14],
    Historial: [15],
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await obtenerUsuario(pk);
        setUsuario(data.usuario);
        setPermisos(data.usuario.permisos || []);
        setEstado(data.usuario.disponible);
      } catch (error) {
        setError('Error al cargar los datos del usuario');
      }
    };
    cargarUsuario();
  }, [pk]);

  const handleCheckboxChange = (permiso) => {
    setPermisos((prevPermisos) => {
      const existePermiso = prevPermisos.includes(permiso);
      return existePermiso
        ? prevPermisos.filter((p) => p !== permiso)
        : [...prevPermisos, permiso];
    });
  };

  const handleEstadoChange = () => {
    setEstado((prevEstado) => (prevEstado === 1 ? 0 : 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarUsuario(pk, {
        permisos,
        disponible: estado,
      });
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => navigate('/panel'), 2000);
    } catch (error) {
      setError('Hubo un error al actualizar el usuario');
    }
  };

  const handleCancel = () => {
    navigate('/panel');
  };

  if (!usuario) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {success && <Components.Modals.success mensaje={success} />}
      {error && <Components.Modals.error mensaje={error} />}
      <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
        <h2 className="text-2xl font-bold text-UP-Secundario mb-4">Administración de Permisos</h2>
        <p className="text-UP-Opaco mb-6">Llena todos los campos para continuar</p>

        <table className="table-auto mb-6 w-full">
          <tbody>
            <tr>
              <th className="text-left px-4 py-2">Nombre:</th>
              <td className="border px-4 py-2">{usuario.nombres}</td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2">Apellido Paterno:</th>
              <td className="border px-4 py-2">{usuario.apellido_p}</td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2">Apellido Materno:</th>
              <td className="border px-4 py-2">{usuario.apellido_m}</td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2">Correo:</th>
              <td className="border px-4 py-2">{usuario.correo}</td>
            </tr>
          </tbody>
        </table>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Editar Permisos:</h3>
          {Object.entries(permisosDisponibles).map(([categoria, listaPermisos]) => (
            <div key={categoria} className="mb-2">
              <h4 className="font-semibold">{categoria}</h4>
              {listaPermisos.map((permiso) => (
                <label key={permiso} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    value={permiso}
                    checked={permisos.includes(permiso)}
                    onChange={() => handleCheckboxChange(permiso)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Permiso {permiso}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Estado:</label>
          <button
            type="button"
            onClick={handleEstadoChange}
            className={`px-4 py-2 rounded ${estado === 1 ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {estado === 1 ? 'Activo' : 'Inactivo'}
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <Components.Botones.Cancelar type="button" onClick={handleCancel} text="Cancelar" />
          <Components.Botones.ConfirmarVerde type="submit" onClick={handleSubmit} text="Confirmar" />
        </div>
      </main>
    </div>
  );
};

export default ViewUserEdit;