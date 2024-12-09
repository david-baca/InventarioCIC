import axios from 'axios';
const areaService = () => {
    const baseApi = import.meta.env.VITE_BASE_API;
    const instance = axios.create({ baseURL: baseApi });
    const section = "areas"
    const ObtenerDetalles = async (id) => {
      try {
        const response = await instance.get(`/areas/details/${id}`);
        return response.data; // Ajusta según la respuesta esperada
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener detalles del área');
      }
    };
    const BuscarOpciones = async (query, fk_execpcion) => {
      try {
        const response = await instance.get(`articulos/sin/area/execption/${fk_execpcion}/${encodeURIComponent(query)}`);
        return response.data.articulos; // Ajusta según tu respuesta de API
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la búsqueda de artículos');
      }
    };
    const Editar = async (id, data) => {
      try {
        const response = await instance.put(`/areas/${id}`, data);
        return response.data; // Ajusta según la respuesta esperada
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error al editar el área');
      }
    };
    const Crear = async (data) => {
        try {
          const response = await instance.post('/areas', data);  // Ruta cambiada a /areas
          return response.data; // Ajustar según la respuesta de la API
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al crear el área');
        }
    };
    const Buscar = async (query) => {
    try {
        const response = await instance.get(`/areas/${encodeURIComponent(query)}`); // Cambiar a áreas
        return response.data.areas; // Ajustar según la respuesta esperada
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la búsqueda de áreas');
    }
    };
    const DarBaja = async (id, motivo) => {
        try {
          const response = await instance.patch(`/areas/baja/${id}`, { motivo });
          return response.data; // Ajusta según la respuesta esperada
        } catch (error) {
          console.log(error);
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al dar de baja el área');
        }
    };
    return { ObtenerDetalles, BuscarOpciones, Editar, Crear, Buscar, DarBaja };
};

export default areaService