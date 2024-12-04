import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components";

// Función de petición para buscar áreas
export const peticion = () => {
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });

  const Buscar = async (query) => {
    try {
      const response = await instance.get(`/areas/${encodeURIComponent(query)}`); // Cambiar a áreas
      return response.data.areas; // Ajustar según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de áreas');
    }
  };

  return { Buscar };
};


const ViewArea = () => {  // Cambié el nombre de "ViewGrup" a "ViewArea"
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState({});
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const Peticion = peticion();
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
    navigate('/almacen/load');  // Ruta para crear una nueva área
  };

  const handleEdit = (pk) => {
    navigate("/almacen/edit/"+pk);  // Ruta para editar una área
  };

  const handleDelete = (pk) => {
    navigate(`/almacen/removal/${pk}`);  // Ruta para eliminar una área
  };

  const handleSearchChange = (value) => {
    setQuery(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      cargarData(value); // Llamamos a cargarData después de 500ms
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      <Componentes.Modals.success mensaje={null} />
      <Componentes.Modals.info mensaje={null} />
      <Componentes.Modals.error mensaje={error} action={() => setError(null)} />

      <Componentes.Inputs.TitleHeader text={"Administración de Áreas"} /> {/* Título cambiado a "Áreas" */}

      <div className='flex items-center'>
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle 
            titulo={"Estas son las áreas disponibles."}  // Mensaje actualizado para áreas
            contenido={"Busque por nombre o descripción del área"}  // Mensaje actualizado
          />
        </div>
        <div className='flex items-center w-[100%]'>
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
          <Componentes.Botones.Crear onClick={handleCreate} />
        </div>
      </div>

      {/* Mostrar las áreas si existen */}
      {data.length > 0 ? (
        <>
        <Componentes.Table.table>
          <Componentes.Table.columna>
            <Componentes.Table.encabezado>Nombre</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Descripción</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Acciones</Componentes.Table.encabezado>
          </Componentes.Table.columna>

          {data.map((element, index) => ((index <= limit.max && index >= limit.min) && (
            <Componentes.Table.columna key={element.pk}>
              <Componentes.Table.fila children={element.codigo} />
              <Componentes.Table.fila children={element.descripcion} />
              <Componentes.Table.fila>
                  <Componentes.Botones.iconPencil 
                    Onclik={() => handleEdit(element.pk)} 
                  />
                  <Componentes.Botones.iconTrash 
                    Onclik={() => handleDelete(element.pk)} 
                  />
              </Componentes.Table.fila>
            </Componentes.Table.columna>)
          ))}
        </Componentes.Table.table>
        <Componentes.Inputs.Paginacion data={data} handleLimit={(value)=>setLimit(value)}/>
        </>
      ) : (
        <div className='flex justify-center h-full items-center'>
          <Componentes.Inputs.TitleSubtitle 
            titulo={"No hay Áreas que mostrar"} 
            contenido={"no se encontraron resultados"} 
          />
        </div>
      )}
    </>
  );
};
export default ViewArea;
