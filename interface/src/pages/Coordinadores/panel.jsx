import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Componentes from '../../components/';
import axios from 'axios';


export const peticionUsuarios = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const obtenerUsuarios = async () => {
    try {
      const response = await instance.get(`/usuarios/all`);  //Ajusta el endpoint si es necesario
      return response.data;  //Ajusta según la estructura de respuesta
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al cargar usuarios');
    }
  };

  return { obtenerUsuarios };
};



const ViewUser = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const p = peticionUsuarios()

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await p.obtenerUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarUsuarios();
  }, []);

  const handleEdit = (id) => {
    navigate(`/coordinadores/edit/${id}`);
  };

  return (
    <>
    <main className="w-full max-w bg-white rounded-lg shadow-lg mt-6 p-6">
          <div className="flex justify-between mt-6">
            <div>
              <h2 className="text-2xl font-bold text-UP-Secundario mb-2">Administración de permisos</h2>
              <p className="text-gray-600 mb-4">Estos son los permisos del Inventario. Los cambios se hacen en tiempo real.</p>
            </div>
           <Link to="./load/" className="inline-block font-bold w-24 py-5" >
             <Componentes.Botones.Crear/>
           </Link>
          </div>
          
      <div className="bg-gray-900 p-4">
        {error && <div className="text-red-600">{error}</div>}
        {usuarios.length > 0 ? (
          <table className="table-auto w-full text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.pk}>
                  <td className="border px-4 py-2">{`${usuario.nombres} ${usuario.apellido_p} ${usuario.apellido_m}`}</td>
                  <td className="border px-4 py-2">{usuario.correo}</td>
                  <td className="border px-4 py-2">{usuario.estado ? 'Activo' : 'Inactivo'}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(usuario.correo)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1 className="text-gray-500">No hay usuarios disponibles</h1>
        )}
      </div>
    </main>
    </>
  );
};


export default ViewUser;