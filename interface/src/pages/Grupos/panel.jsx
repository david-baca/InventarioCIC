import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Función de petición para buscar grupos
export const peticion = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const Buscar = async (query) => {
    try {
      const response = await instance.get(`/grupos/search/${query}`);
      return response.data.grupos; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de grupos');
    }
  };

  return { Buscar };
};

// Vista del Panel de Grupos
const ViewGrup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const Peticion = peticion();

  useEffect(() => {
    const cargarData = async () => {
      if (!query) return; // Evitar llamada a la API si la query está vacía
      setError(null);
      setData([]);

      try {
        const result = await Peticion.Buscar(query);
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarData();
  }, [query]);

  const handleCreate = () => {
    navigate('./cargar');
  };

  const handleEdit = (pk) => {
    navigate(`/grupos/edit/${pk}`);
  };

  const handleDelete = (pk) => {
    navigate(`/grupos/baja/${pk}`);
  };

  return (
    <>
      <div className="bg-blue-950 flex flex-col">
        <button onClick={handleCreate}>Crear</button>
      </div>
      <div className="bg-gray-900 flex flex-col">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar grupos..."
          className="mb-4 p-2"
        />
        {error && <div className="text-red-600">{error}</div>}
        {data.length > 0 ? (
          data.map((element) => (
            <div key={element.pk} className="bg-blue-600 p-2 flex justify-between">
              <div>
                <h1>{element.nombre}</h1>
                <p>Descripción: {element.descripcion}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(element.pk)}>Editar</button>
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

export default ViewGrup;
