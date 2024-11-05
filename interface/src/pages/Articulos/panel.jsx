import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//objeto que contiene las petciones de esta pagina
const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/search/${query}`);
      return response.data; // Assumes response.data is the array expected
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  return { Buscar };
};
//pagina que gestiona los datos recuperados de las peticiones
const ViewArticle = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  //fuincion que se activa cada vez que se cambia y query
  useEffect(() => {
    const cargarData = async () => {
      if (!query) return; // Prevent API call if query is empty

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
  const handlePublish = async () => {
    navigate('./cargar'); 
  };

  return (
    <>
    <div className="bg-blue-950 flex flex-col">
      <button onClick={handlePublish}>
        Crear
      </button>
    </div>
    <div className="bg-gray-900 flex flex-col">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query with input value
        placeholder="Search articles..."
        className="mb-4 p-2"
      />
      {error && <div className="text-red-600">{error}</div>}
      {data.length > 0 ? (
        data.map((element, index) => (
          <h1 key={index} className="bg-blue-600">
            {element.nombres || element.nombre} {/* Ensure properties exist */}
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
