import axios from 'axios';
const articuloService = () => {
    const baseApi = import.meta.env.VITE_BASE_API;
    const instance = axios.create({ baseURL: baseApi });
    const section = "articulos"
    const ObtenerDetalles = async (no_inventario) => {
        try {
          const response = await instance.get(`/${section}/details/${encodeURIComponent(no_inventario)}`);
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
        }
    };
    const EditarArticulo = async (data, id) => {
    try {
        const response = await instance.put(`/${section}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
    };
    const GruposDisponibles = async (query) => {
    try {
        const response = await instance.get(`/grupos/${encodeURIComponent(query)}`);
        return response.data.grupos; // Ajusta según la respuesta esperada
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la búsqueda de grupos');
    }
    };
    const Publicar = async (data) => {
        try {
          const response = await instance.post(`/${section}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error in API interaction');
        }
    };
    const Buscar = async ({ query }) => {
    try {
        const response = await instance.get(`/${section}/search/${encodeURIComponent(query)}`);
        return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
    };
    const EliminarArticulo = async (id, data) => {
    try {
        const response = await instance.patch(`/${section}/baja/${id}`, data,);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en API interaction');
    }
    };
    return { EliminarArticulo, Publicar, ObtenerDetalles, EditarArticulo, GruposDisponibles, Buscar };
};
export default articuloService