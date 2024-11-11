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

  const EliminarArticulo = async (id) => {
    try {
      const response = await instance.delete(`/${section}/${id}`);
      return response.data; // Assumes response.data contains a success message
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  return { ObtenerDetalles, EliminarArticulo };
};

const ViewArticleRenoval = () => {
  const navigate = useNavigate();
  const { pk } = useParams();
  const Peticion = peticion();
  
  const [articulo, setArticulo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setArticulo(result.articulo); // Assumes response contains 'articulo'
      } catch (err) {
        setError(err.message);
      }
    };
    
    cargarArticulo();
  }, [pk]);

  const handleDelete = async () => {
    if (articulo.responsable) {
      setError('No se puede eliminar un artículo asociado a un responsable.');
      return;
    }

    try {
      await Peticion.EliminarArticulo(articulo.pk); // Assumes articulo has a 'pk' field
      navigate('/articulos'); // Redirect to the articles list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Baja de Artículo</h1>
      {error && <div className="text-red-600">{error}</div>}
      {articulo ? (
        <div>
          <h2>¿Está seguro de que desea eliminar el artículo?</h2>
          <p>Nombre: {articulo.nombre}</p>
          <p>Descripción: {articulo.descripcion}</p>
          <p>Costo: {articulo.costo}</p>
          <button onClick={handleDelete} className="bg-red-500 text-white p-2">
            Eliminar Artículo
          </button>
        </div>
      ) : (
        <div>Cargando detalles del artículo...</div>
      )}
    </>
  );
};

export default ViewArticleRenoval;
