import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Components from '../../components';
import axios from 'axios';
//import { peticionUsuario } from './path_to_peticion_usuario';


const ViewUserEdit = () => {

  const { id } = useParams(); // Captura el ID del usuario desde la URL
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [estado, setEstado] = useState(1); // Por defecto activo (1)

  // Lista de permisos predefinidos
  const permisosDisponibles = {
    Articulo: [1, 2, 3],
    Grupos: [4, 5, 6],
    Responsable: [7, 8, 9],
    Movimientos: [10, 11, 12],
    Reporte: [13, 14],
    Historial: [15],
  };

  useEffect(() => {
    // Cargar datos del usuario específico
    const obtenerUsuario = async () => {
      try {
        const response = await axios.get(`/api/usuarios/${id}`);
        setUsuario(response.data.usuario);
        setPermisos(response.data.usuario.permisos || []);
        setEstado(response.data.usuario.disponible);
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    obtenerUsuario();
  }, [id]);

  const handleCheckboxChange = (permiso) => {
    setPermisos((prevPermisos) => {
      const existePermiso = prevPermisos.includes(permiso);
      return existePermiso
        ? prevPermisos.filter((p) => p !== permiso)
        : [...prevPermisos, permiso];
    });
  };

  const handleEstadoChange = () => {
    setEstado((prevEstado) => (prevEstado === 1 ? 0 : 1)); // Cambia entre 1 (activo) y 0 (inactivo)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/usuarios/${id}`, {
        permisos,
        disponible: estado,
      });
      alert('Usuario actualizado exitosamente');
      navigate('/panel');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Hubo un error al actualizar el usuario');
    }
  };

   const handleCancel = () => {
      navigate('/panel');
    };

    if (!usuario) {
      return <div>Cargando datos del usuario...</div>;
    }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
          <h2 className="text-2xl font-bold text-UP-Secundario mb-4">Administración de Permisos</h2>
          <p className="text-UP-Opaco mb-6">Llena todos los campos para continuar</p>

              {/* Tabla de datos del usuario */}
          <table className="table-auto mb-6 w-full">
            <tbody>
              <tr>
                <th className="text-left px-4 py-2">Nombre:</th>
                <td className="border px-4 py-2">{usuario.nombre}</td>
              </tr>
              <tr>
                <th className="text-left px-4 py-2">Apellido Paterno:</th>
                <td className="border px-4 py-2">{usuario.apellidoP}</td>
              </tr>
              <tr>
                <th className="text-left px-4 py-2">Apellido Materno:</th>
                <td className="border px-4 py-2">{usuario.apellidoM}</td>
              </tr>
              <tr>
                <th className="text-left px-4 py-2">Correo:</th>
                <td className="border px-4 py-2">{usuario.correo}</td>
              </tr>
            </tbody>
          </table>

               
              {/* Sección de permisos */}
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


              {/* Botón de cambio de estado */}
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

              



          <h3 className="text-xl font-semibold text-gray-700 mb-4">Selecciona los permisos del administrador</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-UP-Secundario rounded-md">
              <thead>
                <tr className="bg-UP-Secundario text-white">
                  <th className="py-2 px-4 border">Permiso</th>
                  <th className="py-2 px-4 border">Visualización</th>
                  <th className="py-2 px-4 border">Creación</th>
                  <th className="py-2 px-4 border">Editar</th>
                </tr>
              </thead>
              <tbody>
                
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6">
              <Components.Botones.Cancelar type="button" onClick={handleCancel} text={"Cancelar"} /> 
              <Components.Botones.ConfirmarVerde type="button" onClick={handleSubmit} text={"Confirmar"} />
          </div>

        
        </main>
      </div>

    </>
  );
};
export default ViewUserEdit;