import { useState, useEffect, React } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import Componentes from "../../components";
import axios from 'axios';
// import { FaFileExcel, FaArrowLeft } from 'react-icons/fa';
const peticion = () => {
  const section = "asignaciones";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const Buscar = async ({ pk }) => {
    try {
      const response = await instance.get(`/${section}/responsable/${pk}`);
      return response.data; // Suponiendo que response.data es el array esperado
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  const Report = async ({ pk }) => {
    try {
      const response = await instance.post(`/${section}/responsableReport/${pk}`,
        {},
        {
          responseType: 'blob'
        }
      );
      return response
    } catch (error) {
      console.error(error);
    }
  };

  return { Buscar, Report };
};
// Componente principal de la vista de reporte de artículo
const ViewReportResponsible = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
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
        const result = await Peticion.Buscar({ pk });
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarData();
  }, [pk]);

  const handleDowload=async()=>{
    const peticiones = peticion();
    try {
      const response = await peticiones.Report({ pk });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download','Reporte de responsable.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error en la descarga: ", error.message);
    }
  };
  return (
    <>
<Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
    <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
    <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text={"Reporte de artículo"} />
      <div className='flex items-center flex-wrap md:flex-nowrap'>
        <div className='flex items-center w-[100%]'>
          <Componentes.Inputs.TitleSubtitle titulo={"Este es el registro del artículo."}
            contenido={"Usos y devoluciones del artículo."} />
        </div>
        
          <Componentes.Botones.ExcelDownload Onclick={()=>handleDowload()}/>
        
      </div>
        {data.length > 0 ? (
          <>
          <Componentes.Table.table>
            <Componentes.Table.columna>
              <Componentes.Table.encabezado>
                Responsable
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Articulo
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Fecha de entrega
              </Componentes.Table.encabezado>
              <Componentes.Table.encabezado>
                Fecha de devolucion
              </Componentes.Table.encabezado>
            </Componentes.Table.columna>
            {data.map((element,index) => 
              ((index <= limit.max && index >= limit.min) && (
                <Componentes.Table.columna key={element.pk}>
                  <Componentes.Table.fila>
                    {element.Responsable.nombres} {element.Responsable.apellido_p} {element.Responsable.apellido_m}
                    </Componentes.Table.fila>
                  <Componentes.Table.fila >
                    {element.Articulo.nombre}</Componentes.Table.fila>
                  <Componentes.Table.fila >
                    {element.fecha_asignacion}</Componentes.Table.fila>
                  <Componentes.Table.fila>
                    {element.fecha_devolucion}
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

export default ViewReportResponsible;