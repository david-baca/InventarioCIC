// Función de petición para obtener detalles de un grupo
export const peticionDetalles = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const ObtenerDetalles = async (id) => {
    try {
      const response = await instance.get(`/grupos/details/${id}`);
      return response.data.grupo; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener detalles del grupo');
    }
  };

  return { ObtenerDetalles };
};

// Vista de Edición de Grupos
const ViewGrupEdit = () => {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const Peticion = peticionDetalles();

  useEffect(() => {
    const cargarGrupo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(id);
        setGrupo(result);
        setNombre(result.nombre);
        setDescripcion(result.descripcion);
      } catch (error) {
        console.error(error.message);
      }
    };
    cargarGrupo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const peticionEditar = () => {
      const baseApi = import.meta.env.VITE_BASE_API;
      const instance = axios.create({ baseURL: baseApi });

      const Editar = async (id, data) => {
        try {
          const response = await instance.put(`/grupos/${id}`, data);
          return response.data; // Ajusta según la respuesta esperada
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || 'Error al editar el grupo');
        }
      };

      return { Editar };
    };

    const PeticionEditar = peticionEditar();
    try {
      await PeticionEditar.Editar(id, { nombre, descripcion });
      navigate(`/grupos/${id}`);
    } catch (error) {
      console.error('Error al editar el grupo:', error.message);
    }
  };

  if (!grupo) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edición de Grupos</h1>
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <button type="submit">Guardar Cambios</button>
    </form>
  );
};

export default ViewGrupEdit;
