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

  return { ObtenerDetalles };
};

const ViewArticleInformation = () => {
  const navigate = useNavigate();
  const { no_inventario } = useParams();
  const Peticion = peticion();
  
  const [articulo, setArticulo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(no_inventario);
        setArticulo(result.articulo); // Assumes response contains 'articulo'
      } catch (err) {
        setError(err.message);
      }
    };
    
    cargarArticulo();
  }, [no_inventario]);

  return (
    <>
      <h1>Detalles de Artículo</h1>
      {error && <div className="text-red-600">{error}</div>}
      {articulo ? (
        <div>
          <h2>Nombre: {articulo.nombre}</h2>
          <p>Descripción: {articulo.descripcion}</p>
          <p>Costo: {articulo.costo}</p>
          <p>Inventario: {articulo.no_inventario}</p>
          <p>Estado: {articulo.estado}</p>
          <p>Responsable: {articulo.responsable || 'No asignado'}</p>
          {/* Agrega más campos según sea necesario */}
        </div>
      ) : (
        <div>Cargando detalles del artículo...</div>
      )}
    </>
  );
};

export default ViewArticleInformation;
