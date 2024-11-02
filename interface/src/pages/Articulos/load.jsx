import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Publicar = async (data) => {
    try {
      const response = await instance.post(`/${section}`, data);
      return response.data; // Assumes response.data is the expected response object
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  return { Publicar };
};

const ViewArticleLoad = () => {
  const navigate = useNavigate();
  const [noInventario, setNoInventario] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [consumible, setConsumible] = useState('');
  const [error, setError] = useState(null);
  const Peticion = peticion();

  const handlePublish = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const result = await Peticion.Publicar({
        no_inventario: noInventario,
        nombre,
        descripcion,
        costo: parseFloat(costo), // Convert to float
        consumible: parseInt(consumible), // Convert to integer
      });
      console.log('Published:', result); // Handle successful publication
      navigate('/articulos'); // Redirect to the articles list after publishing
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Carga de Artículo</h1>
      <form onSubmit={handlePublish} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="No. Inventario"
          value={noInventario}
          onChange={(e) => setNoInventario(e.target.value)}
          required
          className="p-2"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="p-2"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="p-2"
        />
        <input
          type="number"
          placeholder="Costo"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          required
          className="p-2"
        />
        <input
          type="number"
          placeholder="Consumible (0 o 1)"
          value={consumible}
          onChange={(e) => setConsumible(e.target.value)}
          required
          className="p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Publicar
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </>
  );
};

export default ViewArticleLoad;
