import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Componentes from '../../components'; // Asegúrate de importar los componentes correctamente

// Función de petición para dar de baja un grupo
export const peticionBaja = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const DarBaja = async (id, motivo) => {
    try {
      const response = await instance.patch(`/grupos/${id}/baja`, { motivo }); // Cambiar el endpoint a '/grupos/'
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.log(error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al dar de baja el grupo');
    }
  };

  return { DarBaja };
};

// Vista de Baja de Grupos
const ViewGrupRenoval = () => {
  const { pk } = useParams(); // Obtiene el ID del grupo desde la URL
  const [motivo, setMotivo] = useState('');
  const Peticion = peticionBaja();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(null); 
  const [success, setSuccess] = useState(null); 

  // Funciones para cerrar los modales
  const handleActionInfo = () => {
    setShowInfo(null); 
  };

  const handleActionError = () => {
    setError(null); 
  };

  const handleActionSuccess = () => {
    setSuccess(null); 
    navigate('/grups');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar el error antes de enviar
    setSuccess(null); // Limpiar mensaje de éxito antes de enviar

    try {
      await Peticion.DarBaja(pk, motivo); // Petición para dar de baja el grupo
      setSuccess('Grupo eliminado correctamente'); // Mostrar mensaje de éxito
    } catch (error) {
      setError('Error al dar de baja el grupo: ' + error.message); // Mostrar error
    }
  };

  return (
    <>
      {/* Modales para mostrar los estados */}
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionError} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Componentes.Inputs.TitleHeader text={"Baja de Grupo"} />
        <Componentes.Inputs.TitleSubtitle
          titulo={"Motivo de la Baja"}
          contenido={"Por favor, ingrese el motivo para dar de baja el grupo."}
        />

        <div className="space-y-2">
          <Componentes.Labels.area
            Value={motivo}
            Onchange={(value) => setMotivo(value)}
            Placeholder={"Motivo para dar de baja"}
          />
        </div>

        <div className="flex flex-row w-[100%] gap-4">
          <Componentes.Botones.Cancelar text={"Cancelar"} onClick={() => navigate('/grups')} />
          <Componentes.Botones.ConfirmarRojo text={"Dar de Baja"} />
        </div>
      </form>
    </>
  );
};

export default ViewGrupRenoval;
