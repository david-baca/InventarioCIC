import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Función de petición para dar de baja un grupo
export const peticionBaja = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const DarBaja = async (id, motivo) => {
    try {
      const response = await instance.delete(`/grupos/${id}/baja`, { data: { motivo } });
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al dar de baja el grupo');
    }
  };

  return { DarBaja };
};

// Vista de Baja de Grupos
const ViewGrupRenoval = () => {
  const { id } = useParams();
  const [motivo, setMotivo] = useState('');
  const Peticion = peticionBaja();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Peticion.DarBaja(id, motivo);
      navigate('/grupos'); // Redirigir después de dar de baja
    } catch (error) {
      console.error('Error al dar de baja el grupo:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Baja de Grupos</h1>
      <div>
        <label>Motivo:</label>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
      </div>
      <button type="submit">Dar de Baja</button>
    </form>
  );
};

export default ViewGrupRenoval;
