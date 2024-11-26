import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Componentes from '../../components';

// Función de petición para obtener detalles de un grupo
export const peticionDetalles = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const ObtenerDetalles = async (id) => {
    try {
      const response = await instance.get(`/grupos/details/${id}`);
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener detalles del grupo');
    }
  };

  // API para buscar artículos sin un grupo asignado, excluyendo el grupo que estamos editando
  const BuscarOpciones = async (query, fk_execpcion) => {
    try {
      const response = await instance.get(`articulos/sin/grupo/execption/${fk_execpcion}/${query}`);
      return response.data.articulos; // Ajusta según tu respuesta de API
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de artículos');
    }
  };

  const Editar = async (id, data) => {
    try {
      const response = await instance.put(`/grupos/${id}`, data);
      return response.data; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al editar el grupo');
    }
  };

  return { ObtenerDetalles, BuscarOpciones, Editar };
};

const ViewGrupEdit = () => {
  const { pk } = useParams();  // Obtiene el ID del grupo desde la URL
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [articulos, setArticulos] = useState([]);  // Artículos sin grupo
  const [selectedArticulos, setSelectedArticulos] = useState([]);  // Artículos seleccionados para el grupo
  const [query, setQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Para el debounce de búsqueda
  const Peticion = peticionDetalles();

  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 

  
  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionError = () => { 
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('/grups');
  };

  // Cargar detalles del grupo
  useEffect(() => {
    const cargarGrupo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setGrupo(result.grupo);
        setNombre(result.grupo.nombre);
        setDescripcion(result.grupo.descripcion);
        setSelectedArticulos(result.articulos.map(articulo => articulo.pk)); // Aseguramos que sea un array de PKs
      } catch (error) {
        console.log(error);
      }
    };
    cargarGrupo();
  }, [pk]);

  useEffect(() => {
    cargarArticulos(query);
  }, [query, pk]);

  // Función para cargar artículos sin grupo, excluyendo el grupo que estamos editando
  const cargarArticulos = async (query) => {
    setError(null);
    try {
      const result = await Peticion.BuscarOpciones(query, pk);
      setArticulos(result); // Almacenamos los artículos encontrados
    } catch (err) {
      setError(err.message);  // Manejamos cualquier error
    }
  };

  // Función para manejar el cambio en el estado de los checkboxes (selección de artículos)
  const handleCheckboxChange = (articulo) => {
    setSelectedArticulos((prevSelected) => {
      if (prevSelected.includes(articulo.pk)) {
        // Si ya está seleccionado, lo eliminamos
        return prevSelected.filter((item) => item !== articulo.pk);
      } else {
        // Si no está seleccionado, lo añadimos
        return [...prevSelected, articulo.pk];
      }
    });
    console.log()   
  };

  // Función para manejar la búsqueda con debounce
  const handleSearchChange = (value) => {
    setQuery(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      cargarArticulos(value);
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =await Peticion.Editar(pk, 
      { nombre, descripcion, articulos: [...selectedArticulos] })
      setSuccess(response.message)
    } catch (err) {
      setError(err.message);
    }
  };

  if (!grupo) return <div>Cargando...</div>;  // Muestra un mensaje mientras carga el grupo

  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionError} />

    <form onSubmit={handleSubmit} className="space-y-4">
      <Componentes.Inputs.TitleHeader text={"Edición de Grupo"} />
      <Componentes.Inputs.TitleSubtitle titulo={"Información del Grupo"} contenido={"Actualiza los detalles del grupo."} />
      <div className="space-y-2">
        <Componentes.Labels.text Value={nombre} Onchange={setNombre} Placeholder={"Nombre del Grupo"} />
        <Componentes.Labels.area Value={descripcion} Onchange={setDescripcion} Placeholder={"Descripción del Grupo"} />
      </div>

      <Componentes.Inputs.TitleSubtitle titulo={"Seleccionar Artículos"} contenido={"Seleccione los artículos que desea asociar a este grupo."} />
      <div className="flex items-center w-[100%]">
        <Componentes.Buscador query={query} OnChange={handleSearchChange} />
      </div>
      
      {articulos.length > 0 ? (
        <Componentes.Table.table>
          <Componentes.Table.columna>
              <Componentes.Table.encabezado children={"No. Inventario"}/>
              <Componentes.Table.encabezado children={"Nombre"}/>
              <Componentes.Table.encabezado children={"Costo"}/>
              <Componentes.Table.encabezado children={"Acciones"}/>
          </Componentes.Table.columna>
          {articulos.map((articulo) => (
            <Componentes.Table.columna key={articulo.pk}>
              <Componentes.Table.fila children={articulo.no_inventario}/>
              <Componentes.Table.fila children={articulo.nombre}/>
              <Componentes.Table.fila children={articulo.costo}/>
              <Componentes.Table.fila>
                <Componentes.Labels.checkbox 
                  Value={selectedArticulos.includes(articulo.pk)}  // Verificamos si el PK está en la lista de seleccionados
                  Onchange={() => handleCheckboxChange(articulo)}  // Cambiamos el estado de selección al hacer click
                />
              </Componentes.Table.fila>
            </Componentes.Table.columna>
          ))}
        </Componentes.Table.table>
      ) : (
        <div className="flex justify-center h-full items-center">
          <Componentes.Inputs.TitleSubtitle 
            titulo={"No hay Artículos que mostrar"}
            contenido={"No se encontraron resultados"}
          />
        </div>
      )}

      {error && <Componentes.Modals.error mensaje={error} action={() => setError(null)} />}

      <div className="flex flex-row w-[100%] gap-4">
        <Componentes.Botones.Cancelar text={"Cancelar"} onClick={() => navigate('/grups')} />
        <Componentes.Botones.ConfirmarVerde text={"Guardar Cambios"} />
      </div>
    </form>
    </>
  );
};

export default ViewGrupEdit;
