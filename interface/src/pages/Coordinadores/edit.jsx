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
    Reporte: [13, 14, 0],
    Historial: [15, 0, 0],
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
      <main className="w-full bg-white rounded-lg shadow-lg mt-6 p-6">
        <h2 className="flex items-center text-2xl font-bold bg-UP-Secundario text-UP-Blanco mb-4 pl-8 h-20 w-38 ">Administración de Permisos</h2>
        
        <div className='flex w-full '>
          <p className="text-UP-Opaco mb-6 pr-32">Llena todos los campos para continuar</p>
          
          <div className="">
            <label className="block text-gray-700 font-bold">Estado:</label>
            <button
              type="button"
              onClick={handleEstadoChange}
              className={`px-4 py-2 rounded ${estado === 1 ? 'bg-UP-Exito' : 'bg-UP-Error'} text-white`}
            >
              {estado === 1 ? 'Activo' : 'Inactivo'}
            </button>
          </div>
        </div>
        

        <table className="table-auto mb-6 w-full ">
          <div>            
          <th className="text-left px-4 py-2">Nombre:</th>
          <th className="text-left px-4 py-2">Apellido Paterno:</th>
          <th className="text-left px-4 py-2">Apellido Materno:</th>
          <th className="text-left px-4 py-2">Correo:</th>
          </div>

          <div className='max-w-4xl'>
            <td className="border px-4 py-2 ">{usuario.nombres}</td>
            <td className="border px-4 py-2 " w-full>{usuario.apellido_p}</td>
            <td className="border px-4 py-2 ">{usuario.apellido_m}</td>
            <td className="border px-4 py-2 ">{usuario.correo}</td>
          </div>
        </table>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Editar Permisos:</h3>
          <div className="flex items-center justify-around bg-UP-Secundario text-UP-Blanco mb-4  h-10  ">
            <h2>Permiso</h2>
            <h2>Visualisacion</h2>
            <h2>Creacion</h2>
            <h2>Edicion</h2>
          </div>
          {Object.entries(permisosDisponibles).map(([categoria, listaPermisos]) => (
            <div key={categoria} className="justify-around mb-2 table-auto w-full text-UP-Opaco flex grid-flow-col gap-4">
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
                  
                </label>
              ))}
            </div>
          ))}
        </div>

        

        <div className="flex  space-x-16 ">
          <Components.Botones.Cancelar type="button" onClick={handleCancel} text="Cancelar" />
          <Components.Botones.ConfirmarVerde type="submit" onClick={handleSubmit} text="Confirmar" />
        </div>
      </main>
    </div>
  );
};

export default ViewUserEdit;