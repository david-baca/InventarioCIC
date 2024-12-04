import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components/";
// Objeto que contiene las peticiones de esta página
const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/search/${encodeURIComponent(query)}`);
      return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { Buscar };
};

const ViewArticle = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  const [limit, setLimit] = useState({}); 
  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null);
    navigate('/articles');
  };

  // Función que se activa cada vez que se cambia la query
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
    navigate('./cargar');
  };

  const handleEdit = (pk) => {
    navigate(`/articles/edit/${encodeURIComponent(pk)}`);
  };

  const handleDelete = (pk) => {
    navigate(`/articles/removal/${encodeURIComponent(pk)}`);
  };

  const handleConsult = (pk) => {
    navigate(`/articles/detalles/${encodeURIComponent(pk)}`);
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
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
    <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
    <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text={"Administración de Artículos"} />
      <div className='flex items-center flex-wrap md:flex-nowrap'>
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle titulo={"Estos son los Artículos del inventario."}
            contenido={"Busque por token o nombre del Artículo"} />
        </div>
        <div className='flex items-center w-[100%] flex-wrap sm:flex-nowrap'>
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
          <Componentes.Botones.Crear onClick={handlePublish} />
        </div>
      </div>
        {data.length > 0 ? (
          <>
          <Componentes.Table.table>
            <Componentes.Table.columna>
              <Componentes.Table.encabezado>
                No. Inventario:
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Nombre:
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Costo:
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Acciones:
              </Componentes.Table.encabezado>
            </Componentes.Table.columna>
            {data.map((element,index) => 
              ((index <= limit.max && index >= limit.min) && (
                <Componentes.Table.columna key={element.pk}>
                  <Componentes.Table.fila Onclik={() => handleConsult(element.no_inventario)}>
                    {element.no_inventario}</Componentes.Table.fila>
                  <Componentes.Table.fila Onclik={() => handleConsult(element.no_inventario)}>
                    {element.nombre}</Componentes.Table.fila>
                  <Componentes.Table.fila Onclik={() => handleConsult(element.no_inventario)}>
                    {element.costo}</Componentes.Table.fila>
                  <Componentes.Table.fila>
                    <Componentes.Botones.iconPencil Onclik={() => handleEdit(element.no_inventario)} />
                    <Componentes.Botones.iconTrash Onclik={() => handleDelete(element.no_inventario)} />
                  </Componentes.Table.fila>
                </Componentes.Table.columna>
              )
            ))}
          </Componentes.Table.table>
          <Componentes.Inputs.Paginacion data={data} handleLimit={(value)=>setLimit(value)}/>
          </>
        ) : (
          <div className='flex justify-center h-full items-center'>
            <Componentes.Inputs.TitleSubtitle titulo={"No hay Artículos que mostrar"}
            contenido={"No se encontraron resultados"}/>
          </div>
        )}
      {/* Example view docs
      <img src="http://localhost:3730/uploads/images/1730841801651-06.jfif" alt="Imagen del artículo" />
      <iframe src="http://localhost:3730/uploads/01.pdf" type="application/pdf" width="100%" height="100%"></iframe> */}
    </>
  );
};

export default ViewArticle;
