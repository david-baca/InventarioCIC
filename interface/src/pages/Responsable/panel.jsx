import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from "../../components/";

const peticion = () => {
  const section = "responsables";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ query }) => {
    try {
      const response = await instance.get(`/${section}/search/${query}`);
      return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { Buscar };
};

const ViewResponsable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
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
    navigate('/responsable');
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
    navigate('./load');
  };

  const handleEdit = (pk) => {
    navigate(`/responsable/edit/${pk}`);
  };

  const handleDelete = (pk) => {
    navigate(`/responsable/removal/${pk}`);
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
      
      <Componentes.Inputs.TitleHeader text={"Administración de Reponsables"} />
      <div className='flex items-center'>
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle titulo={"Estos son los Responsables del programa de inventario."}
            contenido={"busque por nombre del responsable."} />
        </div>
        <div className='flex items-center w-[100%]'>
          <Componentes.Buscador query={query} OnChange={handleSearchChange} />
          <Componentes.Botones.Crear onClick={handlePublish} />
        </div>
      </div>
        {data.length > 0 ? (
          <Componentes.Table.table>
            <Componentes.Table.columna>
              <Componentes.Table.encabezado>
                Nombre:
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Apellidos:
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Acciones:
              </Componentes.Table.encabezado>
            </Componentes.Table.columna>
            {data.map((element) => (
              <Componentes.Table.columna key={element.pk}>
                <Componentes.Table.fila>{element.nombres}</Componentes.Table.fila>
                <Componentes.Table.fila>{element.apellido_p} {element.apellido_m}</Componentes.Table.fila>
                <Componentes.Table.fila>
                  <Componentes.Botones.iconPencil Onclik={() => handleEdit(element.pk)} />
                  <Componentes.Botones.iconTrash Onclik={() => handleDelete(element.pk)} />
                </Componentes.Table.fila>
              </Componentes.Table.columna>
            ))}
          </Componentes.Table.table>
        ) : (
          <div className='flex justify-center h-full items-center'>
            <Componentes.Inputs.TitleSubtitle titulo={"No hay Reponsables que mostrar"}
            contenido={"no se encontraron resultados"}/>
          </div>
        )}
    </>
  );
};

export default ViewResponsable;
