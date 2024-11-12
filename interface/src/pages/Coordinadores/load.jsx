import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Componentes from "../../components/";

const handleCancel = () => {
  navigate('/coordinadores');
}

const ViewUserLoad = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
  });

  // Lista de permisos con IDs numéricos
  const [permissions, setPermissions] = useState({
    Articulo: [1, 2, 3],
    Grupos: [4, 5, 6],
    Responsable: [7, 8, 9],
    Movimientos: [10, 11, 12],
    Reporte: [13, 14, 15],
    Historial: [16],
  });

  // Estado de selección para cada permiso
  const [selectedPermissions, setSelectedPermissions] = useState({
    Articulo: [],
    Grupos: [],
    Responsable: [],
    Movimientos: [],
    Reporte: [],
    Historial: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (category, permissionId) => {
    setSelectedPermissions((prevSelected) => {
      const isSelected = prevSelected[category].includes(permissionId);
      return {
        ...prevSelected,
        [category]: isSelected
          ? prevSelected[category].filter((id) => id !== permissionId) // Elimina si ya está seleccionado
          : [...prevSelected[category], permissionId], // Agrega si no está seleccionado
      };
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
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
                className="border rounded px-3 py-2 text-UP-Opaco"
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
              <tbody>
                {Object.keys(permissions).map((category) => (
                  <tr key={category} className="text-center">
                    <td className="py-2 px-4 border">{category}</td>
                    {permissions[category].map((permissionId) => (                                     
                      <td key={permissionId} className="py-2 px-4 border" >
                        <Componentes.Labels.checkbox Value={selectedPermissions[category].includes(permissionId)}
                        Onchange={() => handleCheckboxChange(category, permissionId)}/>                      
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between ">
            <Componentes.Botones.Cancelar text={"Cancelar" } onClick={handleCancel}/>
          {/* <Componentes.Botones.Cancelar text={"Cancelar"} onClick={handleCancel}/> */}
            <Componentes.Botones.ConfirmarVerde text={"Confirmar"} className="  "/>
          </div>

        </main>
      </div>
    </>
  );
};

export default ViewUserLoad;