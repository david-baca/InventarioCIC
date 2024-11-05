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

  const handleEdit = (pk) => {
    navigate(`/articles/edit/${pk}`);
  };

  const handleDelete = (pk) => {
    navigate(`/articles/removal/${pk}`);
  };

  return (
    <>
      <div className="bg-UP-Exito text-UP-Blanco flex flex-col">
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
          data.map((element) => (
            <div key={element.pk} className="bg-blue-600 p-2 flex justify-between">
              <div>
                <h1>{element.nombre}</h1>
                <p>No. Inventario: {element.no_inventario}</p>
                <p>nombre: {element.nombre}</p>
                <p>Costo: {element.costo}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(element.no_inventario)}>Editar</button>
                <button onClick={() => handleDelete(element.pk)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-gray-500">No hay datos disponibles</h1>
        )}
      </div>
    </>
  );
};

export default ViewArticle;
