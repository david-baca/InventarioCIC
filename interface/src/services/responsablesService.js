import axios from 'axios';
import {getFromLocalStorage} from '../context/Credentials';
const responsablesService = () => {
    const credetial = getFromLocalStorage()
    const localUser = credetial.usuario.pk
    const baseApi = import.meta.env.VITE_BASE_API;
    const instance = axios.create({ baseURL: baseApi });
    const section = "responsables";
    const ObtenerDetalles = async (id) => {
        try {
          const response = await instance.get(`/${section}/details/${id}`);
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al obtener los detalles del responsable');
        }
    };
    const EditarResponsable = async (id, data) => {
    try {
        const response = await instance.put(`/${section}/${id}`, {...data, localUser});
        return response.data;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error al editar el responsable');
    }
    };
    const Publicar = async (data) => {
    try {
        const response = await instance.post(`/${section}`, {...data, localUser}, {
        headers: {
            'Content-Type': 'application/json', // Usamos 'application/json' ya que no estamos subiendo archivos
        },
        });
        return response.data;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
    };
    const Buscar = async ({ query }) => {
    try {
        const response = await instance.get(`/${section}/search/${query}`);
        return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
    };
    const EliminarResponsable = async (id, data) => {
    try {
        const response = await instance.patch(`/${section}/baja/${id}`, {data, localUser});
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
    };
    return { EliminarResponsable, Buscar, Publicar, ObtenerDetalles, EditarResponsable };
};
export default responsablesService
