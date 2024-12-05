import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Función de petición para obtener detalles de un grupo 
export const peticionDetallesGrupo = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 

  
  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionError = () => { 
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('/grups');
  };

  const ObtenerDetalles = async (id) => {
    try {
      const response = await instance.get(`/grupos/details/${id}`);
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener detalles del grupo');
    }
  };

  return { ObtenerDetalles };
};

// Vista de Detalles de Grupos
const ViewGrupInformation = () => {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const Peticion = peticionDetallesGrupo();

  useEffect(() => {
    const cargarGrupo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(id);
        setGrupo(result);
      } catch (error) {
        console.error(error.message);
      }
    };
    cargarGrupo();
  }, [id]);

  if (!grupo) return <div>Cargando...</div>;

  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionError} />

    <div>
      <h1>Detalles del Grupo</h1>
      <p>Nombre: {grupo.nombre}</p>
      <p>Descripción: {grupo.descripcion}</p>
      {/* Aquí puedes añadir más detalles si es necesario */}
    </div>
    </>
  );
};

export default ViewGrupInformation;
