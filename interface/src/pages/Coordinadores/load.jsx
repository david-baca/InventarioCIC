import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Componentes from "../../components/";

const ViewUserLoad = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
    permisos: [],
  });

  // Lista de permisos con IDs numéricos
  const permissions = {
    Articulo: [1, 2, 3],
    Grupos: [4, 5, 6],
    Responsable: [7, 8, 9],
    Movimientos: [10, 11, 12],
    Reporte: [13, 14],
    Historial: [15],
  };

  // Manejador de cambios para los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador de cambios para los checkboxes de permisos
  const handleCheckboxChange = (permiso) => {
    setFormData((prevData) => {
      const permisosActuales = prevData.permisos;
      const existePermiso = permisosActuales.includes(permiso);

      return {
        ...prevData,
        permisos: existePermiso
          ? permisosActuales.filter((p) => p !== permiso)
          : [...permisosActuales, permiso],
      };
    });
  };

  // Envío de los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/usuarios', {
        ...formData,
        master: 0,  // Definido por defecto
        disponible: 1,  // Definido por defecto
      });
      alert('Usuario registrado exitosamente');
      setFormData({ nombre: '', apellidoP: '', apellidoM: '', correo: '', permisos: [] });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un error al registrar el usuario');
    }
  };

  // Función para manejar el botón de "Cancelar"
  const handleCancel = () => {
    navigate('./coordinadores'); 
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <main className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-6 p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Administración de Responsables</h2>
          <p className="text-gray-600 mb-6">Llena todos los campos para continuar</p>

          

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

            <div className="flex flex-col">
              <Componentes.Labels.text 
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange} 
                Placeholder={"Nombre"}
              />              
            </div>

            <div className="flex flex-col">
              <Componentes.Labels.text 
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoP}
                onChange={handleChange}
                Placeholder={"Apellido Paterno"}               
              />             
            </div>

            <div className="flex flex-col">
              <Componentes.Labels.text 
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoM}
                onChange={handleChange}
                Placeholder={"Apellido Materno"}               
              /> 
            </div>

            <div className="flex flex-col">
              <Componentes.Labels.text 
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  Placeholder={"Correo electronico"}               
              /> 
            </div>
          </div>

          <h3 className="text-xl font-semibold text-UP-Opaco mb-4">Selecciona los permisos del administrador</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full rounded-md">
              <thead>
                <tr className="bg-UP-Secundario text-UP-Blanco">
                  <th className="py-2 px-4 border">Permiso</th>
                  {['Visualización', 'Creación', 'Editar'].map((header) => (
                    <th key={header} className="py-2 px-4 border">{header}</th>
                  ))}
                </tr>
              </thead>

                        {/* Checkboxes de permisos */}
              <div className="mb-4">
                {Object.entries(permissions).map(([categoria, permisos]) => (
                  <div key={categoria} className="mb-2">
                      <h4 className="font-semibold">{categoria}</h4>
                      {permisos.map((permiso) => (
                      <label key={permiso} className="inline-flex items-center mr-4">
                        <Componentes.Labels.checkbox                 
                          value={permiso}
                          checked={formData.permisos.includes(permiso)}
                          onChange={() => handleCheckboxChange(permiso)}
                          className="form-checkbox"
                        />                    
                        <span className="ml-2"> {permiso}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div> 
            </table>
          </div> 

          <div className="flex justify-between ">
            <Componentes.Botones.Cancelar onClick={handleCancel} text={"Cancelar" } />
            <Componentes.Botones.ConfirmarVerde type="submit" text={"Confirmar"} />
          </div>

        </main>
      </div>
    </>
  );
};

export default ViewUserLoad;