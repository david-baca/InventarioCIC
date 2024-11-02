import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Objeto que contiene las peticiones de esta página
export const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/search/${query}`);
      return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { Buscar };
};

const ViewArticle = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Función que se activa cada vez que se cambia la query
  useEffect(() => {
    const cargarData = async () => {
      if (!query) return; // Evitar llamada a la API si la query está vacía

      const Peticion = peticion();
      setError(null);
      setData([]);

      try {
        const result = await Peticion.Buscar({ query });
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarData();
  }, [query]);

  const handlePublish = () => {
    navigate('./cargar');
  };

  return (
    <>
      <div className="bg-blue-950 flex flex-col">
        <button onClick={handlePublish}>Crear</button>
      </div>
      <div className="bg-gray-900 flex flex-col">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Actualiza la query con el valor del input
          placeholder="Buscar artículos..."
          className="mb-4 p-2"
        />
        {error && <div className="text-red-600">{error}</div>}
        {data.length > 0 ? (
          data.map((element, index) => (
            <h1 key={index} className="bg-blue-600">
              {element.nombres || element.nombre} {/* Asegúrate de que las propiedades existan */}
            </h1>
          ))
        ) : (
          <h1 className="text-gray-500">No hay datos disponibles</h1>
        )}
      </div>
    </>
  );
};

export default ViewArticle;
