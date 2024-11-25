import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Componentes from '../../components'; // Asegúrate de importar los componentes correctamente
// Función de petición para dar de baja un área
export const peticionBaja = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const DarBaja = async (id, motivo) => {
    try {
      const response = await instance.patch(`/areas/${id}/baja`, { motivo });
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.log(error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al dar de baja el área');
    }
  };

  return { DarBaja };
};
// Vista de Baja de Áreas
const ViewStoreRemoval = () => {
  const { pk } = useParams(); // Obtiene el ID del área desde la URL
  const [motivo, setMotivo] = useState('');
  const Peticion = peticionBaja();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 

  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess = () => {
    setSuccess(null); 
    navigate('/almacen');  // Redirige a la vista de áreas
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Peticion.DarBaja(pk, motivo);
      setSuccess('area eliminada'); // Redirigir después de dar de baja
    } catch (error) {
      setError('Error al dar de baja el área:'+ error);
    }
  };

  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionEror} />
    <form onSubmit={handleSubmit} className="space-y-4">
      <Componentes.Inputs.TitleHeader text={"Baja de Área"} />
      <Componentes.Inputs.TitleSubtitle
        titulo={"Motivo de la Baja"}
        contenido={"Por favor, ingrese el motivo para dar de baja el área."}
      />

      <div className="space-y-2">
        <Componentes.Labels.area
          Value={motivo}
          Onchange={(value) => setMotivo(value)}
          Placeholder={"Motivo para dar de baja"}
        />
      </div>

      <div className="flex flex-row w-[100%] gap-4">
        <Componentes.Botones.Cancelar text={"Cancelar"} onClick={() => navigate('/almacen')} />
        <Componentes.Botones.ConfirmarRojo text={"Dar de Baja"} />
      </div>
    </form>
    </>
  );
};

export default ViewStoreRemoval;
