import axios from 'axios';
import {getFromLocalStorage} from '../context/Credentials';
const usuariosService = () => {
    const credetial = getFromLocalStorage()
    const localUser = credetial.usuario.pk
    const baseApi = import.meta.env.VITE_BASE_API;
    const instance = axios.create({ baseURL: baseApi });
    const section = 'usuarios';
    const obtenerUsuario = async (id) => {
        try {
          const response = await instance.get(`/${section}/details/${id}`);
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error('Error al obtener los datos del usuario');
        }
      };
    
      const actualizarUsuario = async (id, data) => {
        try {
          const response = await instance.put(`/${section}/${id}`, {...data, localUser});
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error('Error al actualizar el usuario');
        }
      };
      const Publicar = async (data) => {
        try {
          const response = await instance.post(`/${section}`, {...data, localUser}, {
            
          });
          return response.data;
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
        }
      };
      const obtenerUsuarios = async () => {
        try {
          const response = await instance.get(`/usuarios/all`);  //el endpoint
          return response.data;  
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al cargar usuarios');
        }
      };
    return {obtenerUsuarios, Publicar, obtenerUsuario, actualizarUsuario};
};
export default usuariosService
