import { useState, useEffect, React } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Componentes from "../../components";
import axios from 'axios';
// import { FaFileExcel, FaArrowLeft } from 'react-icons/fa';
const peticion = () => {
  const section = "asignaciones";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/articulos/search/${encodeURIComponent(query)}`);
      return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { Buscar };
};
// Componente principal de la vista de reporte de artículo
const ViewReportArticles = () => {
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
    navigate('/reportes');
  };

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
  const handleHop = (pk) => {
    navigate(`/reportes/articulo/${pk}`)
  };
  return (
    <>
<Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
    <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
    <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text={"Reportes de artículos"} />
      <div className='flex items-center flex-wrap md:flex-nowrap'>
        <div className='flex items-center w-[100%]'>
        <Componentes.Inputs.TitleSubtitle
          titulo={"Estos son los artículos del inventario."}
          contenido={"Seleccione alguno para ver su reporte detallado."}
        />
        </div>
        <div className='flex items-center w-[100%] flex-wrap sm:flex-nowrap'>
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
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
                  <Componentes.Table.fila children={element.no_inventario}/>
                  <Componentes.Table.fila children={element.nombre}/>
                  <Componentes.Table.fila children={element.costo}/>
                  <Componentes.Table.fila>
                    <Componentes.Botones.Saltar Onclick={() =>handleHop(element.pk)}/>
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
    </>
  );
};

export default ViewReportArticles;

