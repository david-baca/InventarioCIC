import { useState, useEffect } from 'react';
import axios from 'axios';

const peticion = () => {
  const section = "articulos"
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/search/${query}`);
      console.log(response.data);
      return response.data; // Asume que response.data es el array esperado
    } catch (error) {
      console.log(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener la descripción del error');
    }
  };

  return { Buscar };
};

const ViewArticle = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarData = async () => {
      const api = peticion(); 
      try {
        const result = await api.Buscar({ query: "a" });
        setData(result); // Asigna los datos obtenidos
      } catch (err) {
        setError(err.message); // Captura el error y lo establece en el estado
      }
    };

    cargarData();
  }, []);

  // Filtra los elementos nulos o indefinidos
  const filteredData = data.filter(element => element !== null && element !== undefined);

  return (
    <div className="bg-gray-900 flex flex-col">
      {error && <div className="text-red-600">{error}</div>}
      {filteredData.length > 0 ? (
        filteredData.map((element, index) => (
          <h1 key={index} className="bg-red-600">
            {element.nombres || element.nombre} {/* Asegúrate de que las propiedades existan */}
          </h1>
        ))
      ) : (
        <h1 className="text-gray-500">No hay datos disponibles</h1>
      )}
    </div>
  );
};
export default ViewArticle;