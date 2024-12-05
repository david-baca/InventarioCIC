import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Componentes from "../../../components";
import {getFromLocalStorage} from '../../../context/Credentials';

const Peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });
  const ObtenerDetallesArticulo = async (no_inventario) => {
    try {
      const response = await instance.get(`/articulos/details/${encodeURIComponent(no_inventario)}`);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };
  const ObtenerDetallesReponsable = async (id) => {
    try {
      const response = await instance.get(`/responsables/details/${id}`);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener los detalles del responsable');
    }
  };
  const Publicar = async ({id,data}) => {
    try {
      const response = await instance.patch(`/asignaciones/${id}/baja`, data);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };
  const discardImg = async (data) => {
    try {
      const response = await instance.patch(`/asignaciones/baja-img`, data);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };
  
  return { discardImg,Publicar,ObtenerDetallesArticulo,ObtenerDetallesReponsable };
};

const ViewRestok = () => {
  const { pkResponsable, pkArticulo } = useParams();
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [motivo, setMotivo] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [error, setError] = useState();
  const [blocked, setBlocked] = useState(null);
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  const [imagenesHTML, setImagenesHTML] = useState([]);
  const peticion = Peticion()
  useEffect(() => {
    const loadResponsable = async () => {
      setLoading(true);
      try {
        const data = await peticion.ObtenerDetallesReponsable(pkResponsable);
        setResponsable(data.responsable);
      } catch (error) {
        console.error("Error al obtener responsable:", error);
      } finally {
        setLoading(false);
      }
    };
    // Función para obtener los detalles del artículo
    const loadArticulo = async () => {
      setLoading(true);
      try {
        const data = await peticion.ObtenerDetallesArticulo(pkArticulo);
        setArticulo(data.articulo);
        let datos = "No hay fotos en esta asignacion";
        const baseApi = import.meta.env.VITE_BASE_API;
        // Asegurarse de que `data.articulo.Condiciones` y `data.articulo.Condiciones[0].Imagenes` no sean null ni undefined
        if (data?.articulo?.Condiciones?.[0]?.Imagenes) {
          datos = "";
          for (let i = 0; i < data.articulo.Condiciones[0].Imagenes.length; i++) {
            // Verifica si la imagen no es null o undefined
            if (data.articulo.Condiciones[0].Imagenes[i]?.imagen) {
              // Almacena las imágenes válidas
              datos= datos+baseApi+(data.articulo.Condiciones[0].Imagenes[i].imagen)+"<br>";
            }
          }
        }
        setImagenesHTML(datos);
        if(data.articulo.responsable === undefined){ setBlocked("Este Articulo na esta asociado a un responsable") }
      } catch (error) {
        console.error("Error al obtener artículo:", error);
      } finally {
        setLoading(false);
      }
    };
    loadResponsable();
    loadArticulo();
  }, [pkResponsable, pkArticulo]);

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
  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (imagenes.length + files.length > 5) {
      setShowInfo("No puedes cargar más de 5 imágenes.");
      return;
    }
    setImagenes(prev => [...prev, ...files]);
  };
  // Handle deleting an image
  const handImageDelete = (index) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };
  const handleCancel = () => {
    navigate('/devoluciones/');
  }
  // Handle form submission
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setShowInfo("Suba el docuemento firmado por las partes antes de continuar.");
      return;
    }
    try{
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("motivo", motivo);
      console.log(articulo)
      const response = await peticion.Publicar({data:formData,
        id:articulo.responsable.Asignaciones[0].pk});
      try{
        if(imagenes.length>0){
        const formData = new FormData();
        for (let i = 0; i < imagenes.length; i++) {
          formData.append('imagenes', imagenes[i]);
        } 
        formData.append("id", articulo.pk);
        const x = await peticion.discardImg(formData);
        }
      }catch(e){

      }
      setSuccess("devolución realizada con éxito.");
    }catch(e){
      console.log(e)
      setError("Hubo un error al realizar la devolución.");
    }
  };
  const generateAndPrint = async () => {
    if (!responsable || !articulo) {
      alert("Datos incompletos para generar el documento.");
      return;
    }
    if (!motivo || !motivo) {
      setShowInfo("Defina el motivo de la devolución.");
      return;
    }
  
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("es-ES", { month: "long" });
    const año = fecha.getFullYear();
    const dataLocal = getFromLocalStorage()
    try {
      // Cargar el archivo HTML de formato
      const response = await fetch('/fromato2.html');
      const htmlText = await response.text();
      // Reemplazar las variables dinámicas en el archivo HTML
      let formattedHtml = htmlText
        .replace('{{fecha}}', `${dia} de ${mes} de ${año}`)
        .replace('{{nombre}}', responsable.nombres)
        .replace('{{responsable}}', responsable.nombres)  // O el nombre del responsable de la asignación
        .replace('{{asignado}}', responsable.nombres)    // Asignado
        .replace('{{no_inventario}}', articulo.no_inventario)
        .replace('{{nombre_articulo}}', articulo.nombre)
        .replace('{{descripcion}}', articulo.descripcion)
        .replace('{{precio}}', articulo.costo)
        .replace('{{comantario}}', motivo)
        .replace('{{imagen1}}', imagenesHTML)
        .replace('{{userName}}', dataLocal.usuario.nombres)
        .replace('{{userName}}', dataLocal.usuario.nombres)
        .replace('{{userLastname}}', dataLocal.usuario.apellido_p+" "+dataLocal.usuario.apellido_m)
        .replace('{{resName}}', responsable.nombres)
        .replace('{{resLastname}}', responsable.apellido_p+" "+responsable.apellido_m)
  
      // Crear una nueva ventana para mostrar el contenido
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.open();
      printWindow.document.write(formattedHtml);
      printWindow.document.close();
  
      // Esperar que la página se haya cargado completamente antes de imprimir
      printWindow.onload = () => {
        printWindow.print();
      }
    }catch(err){
      console.log(err)
    }
    };
  if(blocked!==null)return(<Componentes.Modals.error mensaje={blocked} action={()=>{navigate("/devoluciones/")}}/>)
  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text={"Importacion de responsiva (Devolución)"}/>
      <Componentes.Inputs.TitleSubtitle titulo={"Datos de un articulo"} 
        contenido={"Rellene todos los campos para poder crear un articulo. "}/>
      <form onSubmit={handlePublish} className="flex flex-col space-y-4 gap-3">
        <Componentes.Inputs.TitleSubtitle
          titulo="Motivo de devolucion" 
          contenido="Este campo permite especificar la razón de la devolución de un bien, ya sea por daños o por finalización de su uso."
        />
        <Componentes.Labels.area Onchange={(value) =>setMotivo(value)} Value={motivo} Placeholder={"Motivo"}/>
        <Componentes.Inputs.TitleSubtitle 
          titulo="Evidencias adjuntas (opcional)" 
          contenido="En este apartado deberá agregar 5 fotos del articulo para evidenciar el estado actual del articulo y sus condiciones." 
        />
        <Componentes.Labels.fileimg
            object={imagenes}
            ImageUpload={handleImageUpload}
            clikObjectDelete={handImageDelete}
        />
        <Componentes.Inputs.TitleSubtitle
          titulo={"Presentación de documento de asignación"}
          contenido={"Verifique que el documento sea correcto y suba el documento firmado por las partes."}
        />
        <Componentes.Botones.Imprimir 
          text={"hola"}
          onClick={generateAndPrint}
        />
        <div className="flex items-center justify-between mb-6 w-full">
          <label
            htmlFor="fileUpload"
            className="bg-gray-200 px-4 py-2 rounded-md shadow cursor-pointer hover:bg-gray-300"
          >
            Examinar...
          </label>
          <input
            id="fileUpload"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
          />
          <span className="text-gray-500">
            {selectedFile ? selectedFile.name : "Sin archivos seleccionados"}
          </span>
        </div>
        <div className='flex flex-row w-[100%] gap-4'>
          <Componentes.Botones.Cancelar text={"Cancelar"} onClick={handleCancel}/>
          <Componentes.Botones.ConfirmarVerde text={"Confirmar"}/>
        </div>
      </form>
    </>
  );
};
export default ViewRestok;
