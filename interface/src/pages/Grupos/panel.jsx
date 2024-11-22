import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components";

// Función de petición para buscar grupos
export const peticion = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const Buscar = async (query) => {
    try {
      const response = await instance.get(`/grupos/${query}`);
      return response.data.grupos; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de grupos');
    }
  };

  return { Buscar };
};

// Vista del Panel de Grupos
const ViewGrup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const Peticion = peticion();
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

  // Cargar datos de los grupos cada vez que cambia la query
  useEffect(() => {
    const cargarData = async () => {
      setError(null);
      setData([]);

      try {
        const result = await Peticion.Buscar(query);
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarData();
  }, [query]);

  // Funciones para manejar las acciones de los botones
  const handleCreate = () => {
    navigate('/grups/load');
  };

  const handleEdit = (pk) => {
    navigate("/grups/edit/"+pk);
  };

  const handleDelete = (pk) => {
    navigate(`/grups/removal/${pk}`);
  };

  const handleSearchChange = (value) => {
    setQuery(value);

    // Si hay un timeout previo, lo limpiamos
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Establecemos un nuevo timeout para la búsqueda después de 500ms
    const newTimeout = setTimeout(() => {
      cargarData(value); // Llamamos a cargarData después de 500ms
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionError} />

      <Componentes.Inputs.TitleHeader text={"Administración de Grupos"} />

      <div className='flex items-center'>
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle 
            titulo={"Estos son los grupos disponibles."}
            contenido={"busque por nombre o descripción del grupo"} 
          />
        </div>
        <div className='flex items-center w-[100%]'>
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
          
          <Componentes.Botones.Crear onClick={handleCreate} />
        </div>
      </div>

      {/* Mostrar los grupos si existen */}
      {data.length > 0 ? (
        <Componentes.Table.table>
          <Componentes.Table.columna>
            <Componentes.Table.encabezado>Nombre</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Descripción</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Acciones</Componentes.Table.encabezado>
          </Componentes.Table.columna>

          {data.map((element) => (
            <Componentes.Table.columna key={element.pk}>
              <Componentes.Table.fila children={element.nombre}/>
              <Componentes.Table.fila children={element.descripcion}/>
              <Componentes.Table.fila>
                  <Componentes.Botones.iconPencil 
                    Onclik={() => handleEdit(element.pk)} 
                  />
                  <Componentes.Botones.iconTrash 
                    Onclik={() => handleDelete(element.pk)} 
                  />
              </Componentes.Table.fila>
            </Componentes.Table.columna>
          ))}
        </Componentes.Table.table>
      ) : (
        <div className='flex justify-center h-full items-center'>
          <Componentes.Inputs.TitleSubtitle 
            titulo={"No hay Grupos que mostrar"} 
            contenido={"no se encontraron resultados"} 
          />
        </div>
      )}
    </>
  );
};

export default ViewGrup;
