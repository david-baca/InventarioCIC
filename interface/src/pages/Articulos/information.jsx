import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Components from '../../components';
import {QRCodeSVG} from 'qrcode.react';

const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({ baseURL: baseApi });
  
  const ObtenerDetalles = async (no_inventario) => {
    try {
      const response = await instance.get(`/${section}/details/${encodeURIComponent(no_inventario)}`);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };

  return { ObtenerDetalles };
};

const ViewArticleInformation = () => {
  // Configuración
  const baseApi = import.meta.env.VITE_BASE_API;
  const Peticion = peticion(); // No es necesario useMemo aquí
  const navigate = useNavigate();
  const { pk } = useParams();
  
  // Estado
  const [articulo, setArticulo] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  // Funciones para manejar modales
  const handleActionInfo = () => setShowInfo(null);
  const handleActionError = () => setError(null);
  const printContent = () => {
    const content = document.getElementById("printableArea"); // Obtener el contenido a imprimir // Abrir una nueva pestaña
    const printWindow = window.open('', '_blank'); // Escribir el contenido en la nueva pestaña
    printWindow.document.write('<html><head><title>UPQROO Inventario</title></head><body>');
    printWindow.document.write(content.innerHTML); // Insertar el contenido HTML a imprimir
    printWindow.document.write('</body></html>');
    printWindow.document.close(); // Cerrar el documento para que se renderice
    printWindow.print(); // 
  };
  // Cargar los detalles del artículo
  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setArticulo(result.articulo);  // Asignar el artículo a estado
        if (result.articulo && result.articulo.Condiciones.length > 0) {
          setImagenes(result.articulo.Condiciones[0].Imagenes || []);  // Si tiene condiciones, asignamos las imágenes
        }
        if(result.articulo.responsable) setResponsable(result.articulo.responsable)
      } catch (err) {
        setError(err.message);  // Mostrar mensaje de error si falla la carga
      }
    };
    cargarArticulo();
  }, [pk]);  // Se ejecuta cada vez que pk cambie
  // Mostrar contenido
  return (
    <>
      <Components.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Components.Modals.error mensaje={error} action={handleActionError} />
      
      {/* Título con la información del artículo */}
      <Components.Inputs.TitleHeader text="Detalles del Artículo" />
      {articulo === null ? (
        <div>Articulo no encontrado</div>
      ) : (
        <div className='flex lg:flex-row flex-row-reverse flex-wrap gap-5'>
          <div className="gap-10 flex flex-col items-center w-[100%] lg:w-fit">
            <div className='w-[20rem] h-[20rem] overflow-scroll'>
              <div id ="printableArea" className='w-[21.59cm] h-[27.94cm]'>
                <QRCodeSVG value={baseApi+"/articulos/"+articulo.no_inventario} size={100}/>
              </div>
            </div>
            <Components.Botones.Imprimir onClick={printContent}/>
          </div>
          <div className="gap-10 flex flex-row flex-wrap lg:w-[50%]">
            <Components.Inputs.TitleSubtitle 
              titulo="Nombre"
              contenido={articulo.nombre} 
            />
            <Components.Inputs.TitleSubtitle 
              titulo="Costo"
              contenido={articulo.costo} 
            />
            <Components.Inputs.TitleSubtitle 
              titulo="Consumible"
              contenido={articulo.consumible ? "Si" : "No"} 
            />
            <Components.Inputs.TitleSubtitle 
              titulo="Descripción"
              contenido={articulo.descripcion} 
            />
            <Components.Inputs.TitleSubtitle 
              titulo="No.Inventario"
              contenido={articulo.no_inventario} 
            />
            <Components.Inputs.TitleSubtitle 
              titulo="Grupo"
              contenido={articulo.Grupo === null ? ( "sin asignar")
                :(articulo.Grupo.nombre)}
            />
            <Components.Inputs.TitleSubtitle 
              titulo="Area"
              contenido={articulo.Area === null ? ( "sin asignar")
                :(articulo.Area.codigo)}
            />
            {/* Mostrar imágenes del artículo */}
            {imagenes.length > 0 && (
              <div>
                <h3>Imágenes del Artículo</h3>
                <div className="flex gap-4">
                  {imagenes.map((img, index) => (
                    <img key={index} src={baseApi+img.imagen} alt={`Imagen ${index + 1}`} className="w-32 h-32 object-cover" />
                  ))}
                </div>
              </div>
            )}
            </div>
          {responsable === null ? (
            <>
            <Components.Inputs.TitleHeader text="Detalles de respodsable" />
              <Components.Inputs.TitleSubtitle 
                titulo="Responsable"
                contenido={responsable || "sin asignar"} 
              />
            </>
          ):(
            <>
              <Components.Inputs.TitleHeader text="Detalles de respodsable" />
              <Components.Inputs.TitleSubtitle 
                titulo="Nobre"
                contenido={responsable.nombres+" "+
                  responsable.apellido_p+" "+
                  responsable.apellido_m+" "}/>
              <Components.Inputs.TitleSubtitle 
                titulo="Correo"
                contenido={responsable.correo}/>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ViewArticleInformation;
