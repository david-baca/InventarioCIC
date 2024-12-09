import axios from 'axios';
import {getFromLocalStorage} from '../context/Credentials';
const gruposService = () => {
  const credetial = getFromLocalStorage()
    const localUser = credetial.usuario.pk
    const baseApi = import.meta.env.VITE_BASE_API;
    const instance = axios.create({ baseURL: baseApi });
    const section = "grupos"
    const BuscarOpciones = async (query, fk_execpcion) => {
        try {
          const response = await instance.get(`articulos/sin/grupo/execption/${fk_execpcion}/${encodeURIComponent(query)}`);
          return response.data.articulos; // Ajusta según tu respuesta de API
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error en la búsqueda de artículos');
        }
      };
    
      const Editar = async (id, data) => {
        try {
          const response = await instance.put(`/grupos/${id}`, {...data, localUser});
          return response.data; // Ajusta según la respuesta esperada
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al editar el grupo');
        }
      };
      const ObtenerDetalles = async (id) => {
        try {
          const response = await instance.get(`/grupos/details/${id}`);
          return response.data; // Ajusta según la respuesta esperada
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al obtener detalles del grupo');
        }
      };
      const Crear = async (data) => {
        try {
          const response = await instance.post('/grupos', {...data, localUser});
          return response.data; // Adjust according to the API response
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al crear el grupo');
        }
      };
      const Buscar = async (query) => {
        try {
          const response = await instance.get(`/grupos/${query}`);
          return response.data.grupos; // Ajusta según la respuesta esperada
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error en la búsqueda de grupos');
        }
      };
      const DarBaja = async (id, motivo) => {
        try {
          const response = await instance.patch(`/grupos/baja/${id}`, {motivo, localUser}); // Cambiar el endpoint a '/grupos/'
          return response.data; // Ajusta según la respuesta esperada
        } catch (error) {
          console.log(error);
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error al dar de baja el grupo');
        }
      };
    return {DarBaja, Buscar, Crear, ObtenerDetalles, BuscarOpciones, Editar};
};
export default gruposService