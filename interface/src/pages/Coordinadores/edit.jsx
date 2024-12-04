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
    Reporte: [13, 14, 16],
    Historial: [15, 17, 18],
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await obtenerUsuario(pk);
        setUsuario(data.usuario);
        let Funciones_pk = []
        for(let i=0;i<data.permisos.length;i++){
          Funciones_pk.push(data.permisos[i].Funciones_pk)
        }
        console.log(Funciones_pk)
        setPermisos(Funciones_pk);
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
  

  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('../coordinadores');
  };

  const handleEstadoChange = () => {
    setEstado((prevEstado) => (prevEstado === true ? false : true));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarUsuario(usuario.pk, {
        permisos,
        disponible: estado,
      });
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => navigate('../coordinadores'), 2000);
    } catch (error) {
      setError('Hubo un error al actualizar el usuario');
    }
  };

  const handleCancel = () => {
    navigate('../coordinadores');
  };

  if (!usuario) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className="min-h-screen  flex flex-col items-center p-4">
      <Components.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Components.Modals.error mensaje={error} action={handleActionEror}/>
      <main className="w-full rounded-lg mt-6 p-6">
        <h2 className="flex items-center text-2xl font-bold bg-UP-Secundario text-UP-Blanco mb-4 pl-8 h-20 w-38 ">Administración de Permisos</h2>
        
        <div className='flex w-full '>
          <p className="text-UP-Negro mb-6 w-full font-bold">Estos son los permisos del Inventario.</p>
          
          <div className="flex items-center">
            <label className="ml-auto text-UP-Opaco font-bold">Estado:</label>
            <button
              type="button"
              onClick={handleEstadoChange}
              className={`ml-auto px-1 py-1 rounded-lg ${estado === true ? 'bg-UP-Exito' : 'bg-UP-Error'} text-white`}
            >
              {estado === true ? 'Activo' : 'Inactivo'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mb-6 w-full ">

          <div className="flex items-center justify-around bg-UP-Secundario text-UP-Blanco mb-4  h-10">
            <th >Correo</th>
            <th>Usuario</th>
          </div>

          <div className="flex items-center justify-around">

            <div >
              <td >{usuario.correo}</td>
            </div>

            <div>
              <td >{usuario.nombres}</td>
              <td>{usuario.apellido_p}</td>
              <td>{usuario.apellido_m}</td>
            </div>

          </div>

        </div>
        


        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Editar Permisos:</h3>
          <div className="flex items-center justify-around bg-UP-Secundario text-UP-Blanco mb-4  h-10">
            <h2 className='w-1/6'>Permiso</h2>
            <h2>Visualisacion</h2>
            <h2>Creacion</h2>
            <h2>Edicion</h2>
          </div>
          {Object.entries(permisosDisponibles).map(([categoria, listaPermisos]) => (
            <div key={categoria} className="justify-around mb-2 table-auto w-full text-UP-Opaco flex grid-flow-col gap-4">
              
              <div className="font-semibold w-1/6">
                <h4 >{categoria}</h4>
              </div>
              
              {listaPermisos.map((permiso) => (
                <label key={permiso} className="inline-flex items-center mr-4">
                  <Components.Labels.checkbox
                    Value={permisos.includes(permiso)}
                    Onchange={() => handleCheckboxChange(permiso)}
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