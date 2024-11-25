import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Componentes from '../../components/';
import axios from 'axios';


export const peticionUsuarios = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const obtenerUsuarios = async () => {
    try {
      const response = await instance.get(`/usuarios/all`);  //el endpoint
      return response.data;  
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
    <div className="min-h-screen bg-UP-Blanco flex flex-col items-center p-4 justify-between">
      <main className="w-full rounded-lg mt-6 p-6">
            <div className="justify-between mt-6">
              <div>
                <h2 className="flex items-center text-2xl font-bold bg-UP-Secundario text-UP-Blanco mb-4 pl-8 h-20 w-38 ">Administración de permisos</h2>
                <div className='flex'>
                  <div>
                    <p className="text-UP-Opaco mb-4">Estos son los permisos del Inventario. </p>
                    <p className="text-UP-Opaco mb-4">Los cambios se hacen en tiempo real.</p>
                  </div>

                  <Link to="./load/" className="inline-block font-bold w-24 py-5 ml-auto" >
                    <Componentes.Botones.Crear/>
                  </Link>
                  
                </div>
              </div>
            </div>
            
        <div className="bg-UP-Blanco ">
          {error && <div className="text-UP-Error">{error}</div>}
          {usuarios.length > 0 ? (
            <table className="table-auto w-full text-UP-Opaco">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-UP-Secundario text-UP-Blanco">Nombre</th>
                  <th className="px-4 py-2 bg-UP-Secundario text-UP-Blanco">Correo</th>
                  <th className="px-4 py-2 bg-UP-Secundario text-UP-Blanco">Estado</th>
                  <th className="px-4 py-2 bg-UP-Secundario text-UP-Blanco">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.pk}>
                    <td className="border px-4 py-2">{`${usuario.nombres} ${usuario.apellido_p} ${usuario.apellido_m}`}</td>
                    <td className="border px-4 py-2">{usuario.correo}</td>
                    <td className="border px-4 py-2">{usuario.estado ? 'Activo' : 'Inactivo'}</td>
                    <td className="border px-4 py-2">

                      <div className='flex place-items-center w-full'>
                        <button className="bg-UP-Primario text-UP-Blanco py-1 px-4 rounded-lg text-sm hover:bg-UP-Auxiliar transition duration-300 place-items-center"
                          onClick={() => handleEdit(usuario.correo)}>
                          Editar
                        </button>
                      </div>
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
    </div>
      
  );
};


export default ViewUser;