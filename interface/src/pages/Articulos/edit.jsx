import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const ObtenerDetalles = async (no_inventario) => {
    try {
      const response = await instance.get(`/${section}/details/${no_inventario}`);
      return response.data; // Assumes response.data contains the article details
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  const EditarArticulo = async (data, id) => {
    try {
      const response = await instance.put(`/${section}/${id}`, data);
      return response.data; // Assumes response.data contains the updated article data
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  return { ObtenerDetalles, EditarArticulo };
};

const ViewArticleEdit = () => {
  const navigate = useNavigate();
  const { no_inventario } = useParams();
  const Peticion = peticion();
  
  const [articulo, setArticulo] = useState(null);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [consumible, setConsumible] = useState('');

  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(no_inventario);
        setArticulo(result.articulo); // Assumes response contains 'articulo'
        setNombre(result.articulo.nombre);
        setDescripcion(result.articulo.descripcion);
        setCosto(result.articulo.costo);
        setConsumible(result.articulo.consumible);
      } catch (err) {
        setError(err.message);
      }
    };
    
    cargarArticulo();
  }, [no_inventario]);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (articulo.responsable) {
      setError('No se puede editar un artículo asociado a un responsable.');
      return;
    }

    try {
      const updatedData = {
        no_inventario,
        nombre,
        descripcion,
        costo: parseFloat(costo),
        consumible: parseInt(consumible),
      };
      await Peticion.EditarArticulo(updatedData, articulo.pk); // Assumes articulo has a 'pk' field
      navigate('/articulos'); // Redirect to the articles list after editing
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Editar Artículo</h1>
      {error && <div className="text-red-600">{error}</div>}
      {articulo ? (
        <form onSubmit={handleEdit} className="flex flex-col space-y-4">
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
            Actualizar
          </button>
        </form>
      ) : (
        <div>Cargando detalles del artículo...</div>
      )}
    </>
  );
};

export default ViewArticleEdit;
