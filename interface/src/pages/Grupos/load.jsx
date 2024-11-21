import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components/";

// API call functions
export const peticionCrear = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });
  const Crear = async (data) => {
    try {
      const response = await instance.post('/grupos', data);
      return response.data; // Adjust according to the API response
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al crear el grupo');
    }
  };
  // API to search articles without a group assigned
  const BuscarOpciones = async (query) => {
    try {
      const response = await instance.get(`articulos/sin/grupo/${query}`);
      return response.data.articulos; // Adjust according to your API response
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de artículos');
    }
  };
  return { Crear, BuscarOpciones };
};

const ViewGrupLoad = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [articulos, setArticulos] = useState([]); // To store articles that are not assigned to any group
  const [selectedArticulos, setSelectedArticulos] = useState([]); // To store selected articles for the group
  const [query, setQuery] = useState(''); // Search query for articles
  const Peticion = peticionCrear();

  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 

  
  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('/grup');
  };

  useEffect(() => {
    const cargarData = async () => {
      setError(null);
      try {
        const result = await Peticion.BuscarOpciones(query);
        setArticulos(result);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarData();
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create group with selected articles 
      await Peticion.Crear({ nombre, descripcion, articulos: selectedArticulos });
      setSuccess("Grupo correctanente guardado")
    } catch (error) {
      console.error('Error al crear el grupo:', error.message);
    }
  };
  
  const handleCheckboxChange = (newNumber) => {
    console.log(newNumber)
    setSelectedArticulos((prevArticulos) => {
      if (prevArticulos.includes(newNumber)) {
        return prevArticulos.filter((num) => num !== newNumber);
      } else {
        return [...prevArticulos, newNumber];
      }
    });
  };

  const handleSearchChange = (value) => {
    setQuery(value);
    // Si hay un timeout previo, lo limpiamos
    if (debounceTimeout) clearTimeout(debounceTimeout);
    // Establecemos un nuevo timeout para la búsqueda después de 500ms
    const newTimeout = setTimeout(() => {
      cargarData(value); // Llamamos a cargarData después de 500ms
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Componentes.Inputs.TitleHeader text={"Carga de Grupo"} />
      <Componentes.Inputs.TitleSubtitle titulo={"Información del Grupo"} contenido={"Ingrese los detalles del nuevo grupo."} />
      <Componentes.Labels.text Value={nombre} Onchange={setNombre} Placeholder={"Nombre del Grupo"} />
      <Componentes.Labels.area Value={descripcion} Onchange={setDescripcion} Placeholder={"Descripción del Grupo"} />
      <div className='flex items-center w-[100%]'>
        <Componentes.Inputs.TitleSubtitle titulo={"Seleccionar Artículos"} contenido={"Seleccione los artículos que desea asociar a este grupo."} />
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
              <Componentes.Table.columna key={articulo.id}>
                <Componentes.Table.fila children={articulo.no_inventario}/>
                <Componentes.Table.fila children={articulo.nombre}/>
                <Componentes.Table.fila children={articulo.costo}/>
                <Componentes.Table.fila>
                {articulo.pk}
                  <Componentes.Labels.checkbox
                    value={articulo}
                    checked={articulos.includes(articulo)}
                    Onchange={() => handleCheckboxChange(articulo)}
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
        <Componentes.Botones.ConfirmarVerde text={"Crear Grupo"} />
      </div>
    </form>
    </>
  );
};

export default ViewGrupLoad;
