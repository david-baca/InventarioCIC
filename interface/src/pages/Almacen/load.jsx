import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components/";

// Funciones de llamada API
export const peticionCrear = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  // API para crear área
  const Crear = async (data) => {
    try {
      const response = await instance.post('/areas', data);  // Ruta cambiada a /areas
      return response.data; // Ajustar según la respuesta de la API
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al crear el área');
    }
  };

  // API para buscar artículos sin área asignada
  const BuscarOpciones = async (query) => {
    try {
      const response = await instance.get(`articulos/sin/area/${encodeURIComponent(query)}`);  // Cambiar ruta a /area
      return response.data.articulos; // Ajustar según la respuesta de la API
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de artículos');
    }
  };

  return { Crear, BuscarOpciones };
};

const ViewAreaLoad = () => {  // Cambié el nombre de "ViewGrupLoad" a "ViewAreaLoad"
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [articulos, setArticulos] = useState([]); // Para almacenar artículos no asignados a ningún área
  const [selectedArticulos, setSelectedArticulos] = useState([]); // Para almacenar artículos seleccionados para el área
  const [query, setQuery] = useState(''); // Query de búsqueda para artículos
  const [limit, setLimit] = useState({});
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
  const handleActionSuccess = () => {
    setSuccess(null); 
    navigate('/almacen');  // Redirige a la vista de áreas
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
      // Crear área con los artículos seleccionados 
      await Peticion.Crear({ codigo, descripcion, articulos: selectedArticulos });
      setSuccess("Área correctamente guardada");
    } catch (error) {
      console.error('Error al crear el área:', error.message);
    }
  };

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
  };

  const handleSearchChange = (value) => {
    setQuery(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      cargarData(value);
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionEror} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Componentes.Inputs.TitleHeader text={"Carga de Área"} />
        <Componentes.Inputs.TitleSubtitle titulo={"Información del Área"} contenido={"Ingrese los detalles correspondientes para el alta de la nueva área."} />
        <Componentes.Labels.text Value={codigo} Onchange={setCodigo} Placeholder={"Nombre del Área"} />
        <Componentes.Labels.area Value={descripcion} Onchange={setDescripcion} Placeholder={"Descripción del Área"} />
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle titulo={"Seleccionar Artículos"} contenido={"Seleccione los artículos que desea asociar con esta área."} />
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
        </div>
        
        {articulos.length > 0 ? (
          <>
            <Componentes.Table.table>
              <Componentes.Table.columna>
                  <Componentes.Table.encabezado children={"No. Inventario"} />
                  <Componentes.Table.encabezado children={"Nombre"} />
                  <Componentes.Table.encabezado children={"Costo"} />
                  <Componentes.Table.encabezado children={"Acciones"} />
              </Componentes.Table.columna>
              {articulos.map((articulo, index) => ((index <= limit.max && index >= limit.min) && (
                <Componentes.Table.columna key={articulo.id}>
                  <Componentes.Table.fila children={articulo.no_inventario} />
                  <Componentes.Table.fila children={articulo.nombre} />
                  <Componentes.Table.fila children={articulo.costo} />
                  <Componentes.Table.fila>
                    <Componentes.Labels.checkbox
                      Value={selectedArticulos.includes(articulo.pk)}
                      Onchange={() => handleCheckboxChange(articulo)}
                    />
                  </Componentes.Table.fila>
                </Componentes.Table.columna>)
              ))}
            </Componentes.Table.table>
            <Componentes.Inputs.Paginacion data={articulos} handleLimit={(value) => setLimit(value)} />
          </>
        ) : (
          <div className="flex flex-col items-center mt-4">
            <Componentes.Inputs.TitleSubtitle 
              titulo={"No hay artículos para mostrar."} 
              contenido={"No se encontraron resultados"} 
            />
          </div>
        )}
        {error && <Componentes.Modals.error mensaje={error} action={() => setError(null)} />}
        <div className="flex flex-row w-[100%] justify-center mt-4 gap-3">
          <Componentes.Botones.Cancelar text={"Cancelar"} onClick={() => navigate('/almacen')} />
          <Componentes.Botones.ConfirmarVerde text={"Crear Área"} />
        </div>
      </form>   
    </>
  );
};

export default ViewAreaLoad;
