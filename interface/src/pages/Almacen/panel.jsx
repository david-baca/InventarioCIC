import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components/";

const peticion = () => {
  const section = "almacen";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/search/${query}`);
      return response.data; 
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { Buscar };
};

const ViewStore = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const cargarData = async () => {
      const Peticion = peticion();
      setError(null);
      setData([]);

      try {
        const result = await Peticion.Buscar({ query });
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarData();
  }, [query]);

  const handlePublish = () => {
    navigate('/almacen/load');  // Redirigir a la ruta de carga
  };

  const handleEdit = (pk) => {
    navigate(`/almacen/edit/${pk}`);
  };

  const handleDelete = (pk) => {
    navigate(`/almacen/removal/${pk}`);
  };

  const handleTable = (pk) => {
    navigate(`/almacen/details/${pk}`);
  };

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  return (
    <>
      <Componentes.Inputs.TitleHeader text={"Administración de Almacén"} />
      <div className='flex items-center'>
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle 
            titulo={"Estos son los elementos del almacén."}
            contenido={"Busque por código o nombre del elemento"} 
          />
        </div>
        <div className='flex items-center w-[100%]'>
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
          <Componentes.Botones.Crear onClick={handlePublish}  />
        </div>
      </div>
      {error && <div className="text-red-600">{error}</div>}

      {data.length > 0 ? (
        <Componentes.Table.table>
          <Componentes.Table.columna>
            <Componentes.Table.encabezado>Código:</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Nombre:</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Categoría:</Componentes.Table.encabezado>
            <Componentes.Table.encabezado>Acciones:</Componentes.Table.encabezado>
          </Componentes.Table.columna>
          {data.map((element) => (
            <Componentes.Table.columna key={element.pk} Onclik={() => handleTable(element.pk)}>
              <Componentes.Table.fila>{element.codigo}</Componentes.Table.fila>
              <Componentes.Table.fila>{element.nombre}</Componentes.Table.fila>
              <Componentes.Table.fila>{element.categoria}</Componentes.Table.fila>
              <Componentes.Table.fila>
                <Componentes.Botones.iconPencil Onclik={() => handleEdit(element.pk)} />
                <Componentes.Botones.iconTrash Onclik={() => handleDelete(element.pk)} />
              </Componentes.Table.fila>
            </Componentes.Table.columna>
          ))}
        </Componentes.Table.table>
      ) : (
        <div className='flex justify-center h-full items-center'>
          <Componentes.Inputs.TitleSubtitle 
            titulo={"No hay elementos que mostrar"}
            contenido={"No se encontraron resultados"} 
          />
        </div>
      )}
    </>
  );
};

export default ViewStore;
