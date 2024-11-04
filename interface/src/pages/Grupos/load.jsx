import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Función de petición para crear un nuevo grupo
export const peticionCrear = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const Crear = async (data) => {
    try {
      const response = await instance.post('/grupos', data);
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al crear el grupo');
    }
  };

  return { Crear };
};

// Vista de Carga de Grupos
const ViewGrupLoad = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const Peticion = peticionCrear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Peticion.Crear({ nombre, descripcion });
      navigate('/grupos'); // Redirigir después de crear
    } catch (error) {
      console.error('Error al crear el grupo:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Carga de Grupos</h1>
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <button type="submit">Crear Grupo</button>
    </form>
  );
};

export default ViewGrupLoad;
