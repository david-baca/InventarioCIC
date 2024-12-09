import axios from 'axios';
import {getFromLocalStorage} from '../context/Credentials';
const asignacionesService = () => {
    const credetial = getFromLocalStorage()
    const localUser = credetial.usuario.pk
    const baseApi = import.meta.env.VITE_BASE_API;
    const instance = axios.create({ baseURL: baseApi });
    const ObtenerDetallesArticulo = async (no_inventario) => {
        try {
          const response = await instance.get(`/articulos/details/${encodeURIComponent(no_inventario)}`);
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
        }
    };
    const ObtenerDetallesReponsable = async (id) => {
    try {
        const response = await instance.get(`/responsables/details/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error al obtener los detalles del responsable');
    }
    };
    const Asignar = async (formData) => {
    try {
        formData.append("localUser", localUser);
        // Enviar los datos con el archivo al endpoint correspondiente
        const response = await instance.post(`/asignaciones/crearAsignacion`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Asegúrate de usar el tipo de contenido correcto
        },
        });
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error al crear la asignación');
    }
    };
    const Publicar = async ({id,data}) => {
    try {
        data.append("localUser", localUser);
        const response = await instance.patch(`/asignaciones/${id}/baja`, data);
        return response.data;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
    };
    const discardImg = async (data) => {
    try {
        const response = await instance.patch(`/asignaciones/baja-img`, data);
        return response.data;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
    };
    return {discardImg, Publicar, Asignar,ObtenerDetallesArticulo,ObtenerDetallesReponsable}
};
export default asignacionesService
