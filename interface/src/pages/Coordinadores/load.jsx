import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Componentes from "../../components/";

const peticionUsuarios = () => {
  const section = 'usuarios';
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Publicar = async (data) => {
    try {
      const response = await instance.post(`/${section}`, data, {
        
      });
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { Publicar };
};

const ViewUserLoad = () => {
  const [nombre, setNombre] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [correo, setCorreo] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  
  const navigate = useNavigate();
  const { Publicar } = peticionUsuarios();

  const permissions = {
    Articulo: [1, 2, 3],
    Grupos: [4, 5, 6],
    Responsable: [7, 8, 9],
    Movimientos: [10, 11, 12],
    Reporte: [13, 14, 0],
    Historial: [15, 0, 0],
  };

  const handleCheckboxChange = (newNumber) => {
    console.log(newNumber)
    setPermisos((prevPermisos) => {
      if (prevPermisos.includes(newNumber)) {
        // Si el número ya existe, lo eliminamos de la lista
        return prevPermisos.filter((num) => num !== newNumber);
      } else {
        // Si el número no existe, lo agregamos a la lista
        return [...prevPermisos, newNumber];
      }
    });
  };

  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('../coordinadores');
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const formData = {
      nombre: nombre,
      apellido_p: apellidoP,
      apellido_m: apellidoM,
      correo: correo,
      permisos: permisos,
      master: 0, // Definido por defecto
      disponible: 1, // Definido por defecto
    };

    try {
      console.log(formData);
      await Publicar(formData);
      setSuccess('Usuario registrado exitosamente');
      // Resetear los campos
      setNombre('');
      setApellidoP('');
      setApellidoM('');
      setCorreo('');
      setPermisos([]);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un error al registrar el usuario');
    }
  };

  const handleCancel = () => {
    navigate('../coordinadores');
  };

  return (
    <div className="min-h-screen bg-UP-Blanco flex flex-col items-center p-4 justify-between">
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <form onSubmit={handlePublish} className="w-full bg-UP-Blanco mt-6 p-6">
        <h2 className="flex items-center text-2xl font-bold bg-UP-Secundario text-UP-Blanco mb-4 pl-8 h-20 w-38 ">Administración de Responsables</h2>
        <p className="text-UP-Negro mb-6 text-2 font-bold">Llena todos los campos para continuar</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Componentes.Labels.text
            value={nombre}
            Onchange={(e) => setNombre(e)}
            Placeholder="Nombre"
          />
          <Componentes.Labels.text
            value={apellidoP}
            Onchange={(e) => setApellidoP(e)}
            Placeholder="Apellido Paterno"
          />
          <Componentes.Labels.text
            value={apellidoM}
            Onchange={(e) => setApellidoM(e)}
            Placeholder="Apellido Materno"
          />
          <Componentes.Labels.text
            
            value={correo}
            Onchange={(e) => setCorreo(e)}
            Placeholder="Correo electrónico"
          />
        </div>

        <h3 className="text-UP-Negro mb-6 text-2 font-bold">Selecciona los permisos del administrador</h3>
        <div className="flex items-center justify-around bg-UP-Secundario text-UP-Blanco mb-4  h-10  ">
        <h2>Permiso</h2>
        <h2>Visualisacion</h2>
        <h2>Creacion</h2>
        <h2>Edicion</h2>
        </div>
        <div className="overflow-x-auto mb-4">
          {Object.entries(permissions).map(([categoria, permisos]) => (
            <div key={categoria} className="justify-around mb-2 table-auto w-full text-UP-Opaco flex grid-flow-col gap-4">
              
              <h4 className="font-semibold ">{categoria}</h4>
              
              {permisos.map((permiso) => (
                
                  <Componentes.Labels.checkbox
                    value={permiso}
                    checked={permisos.includes(permiso)}
                    Onchange={() => handleCheckboxChange(permiso)}
                    className="form-checkbox"
                  />
                  
                
              ))}
            </div>
            
          ))}
        </div>

        <div className="flex  space-x-16 ">
          <Componentes.Botones.Cancelar onClick={handleCancel} text="Cancelar" />
          <Componentes.Botones.ConfirmarVerde type="submit" text="Confirmar" />
        </div>
      </form>
    </div>
  );
};

export default ViewUserLoad;