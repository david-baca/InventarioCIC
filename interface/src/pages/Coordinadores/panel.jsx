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
      return response.data.usuarios;  //Ajusta según la estructura de respuesta
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

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await peticionUsuarios().obtenerUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarUsuarios();
  }, []);

  const handleEdit = (id) => {
    navigate(`/usuarios/edit/${id}`);
  };

  return (
    <>
    <main className="w-full max-w bg-white rounded-lg shadow-lg mt-6 p-6">
          <div>
           <h2 className="text-2xl font-bold text-UP-Secundario mb-2">Administración de permisos</h2>
           <p className="text-gray-600 mb-4">Estos son los permisos del Inventario. Los cambios se hacen en tiempo real.</p>
           <div className="text-right">
           <Link to="./load/" className="inline-block font-bold w-24 py-5" >
             <Componentes.Botones.Crear/>
           </Link>
           </div>
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
                <tr key={usuario.id}>
                  <td className="border px-4 py-2">{usuario.nombre}</td>
                  <td className="border px-4 py-2">{usuario.correo}</td>
                  <td className="border px-4 py-2">{usuario.estado ? 'Activo' : 'Inactivo'}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(usuario.id)}
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



  //  return (
  //    <>
      
  //        <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
  //          <h2 className="text-2xl font-bold text-UP-Secundario mb-2">Administración de permisos</h2>
  //          <p className="text-gray-600 mb-4">Estos son los permisos del Inventario. Los cambios se hacen en tiempo real.</p>
  //          <Link to="./load/">
  //            <Componentes.Botones.Crear/>
  //          </Link>
          

  //          <div className="overflow-x-auto">
  //            <table className="min-w-full bg-white border border-UP-Secundario rounded-md">
  //              <thead>
  //                <tr className="bg-UP-Secundario text-white">
  //                  <th className="py-2 px-4 border">Correos</th>
  //                  <th className="py-2 px-4 border">Usuarios</th>
  //                  <th className="py-2 px-4 border">Estado</th>
  //                  <th className="py-2 px-4 border">Permisos</th>
  //                </tr>
  //              </thead>
  //              <tbody>
  //                <tr className="text-center border-b hover:bg-gray-100">
  //                  <td className="py-2 px-4 border">user@upqroo.edu.mx</td>
  //                  <td className="py-2 px-4 border">David Baca</td>
  //                  <td className="py-2 px-4 border text-UP-Exito">Activo</td>
  //                  <td className="py-2 px-4 border">
  //                    <Link to="./edit/">
  //                      <Componentes.Botones.Edit/>
  //                    </Link>
                    
  //                    </td>
  //                </tr>
  //                   Repite la fila para más usuarios 
  //              </tbody>
  //            </table>
  //          </div>
  //        </main>
      
  //    </>
  //  );

export default ViewUser;