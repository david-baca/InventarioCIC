import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Publicar = async ({ no_inv }) => {
    try {
      const response = await instance.post(`/${section}`, { no_inv });
      return response.data; // Assumes response.data is the response object expected
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  return { Publicar };
};
const ViewArticleLoad = () => {
  const [error, setError] = useState(null);
  const Peticion = peticion();

  const handlePublish = async () => {
    try {
      const result = await Peticion.Publicar({ no_inv: "1234" });
      console.log('Published:', result); // Handle successful publication
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
        <h1>carga de articulo</h1>
        <button onClick={handlePublish}>
          Click to Publish
        </button>
        
        {error && <div className="text-red-600">{error}</div>}
    </>
  );
};
export default ViewArticleLoad;