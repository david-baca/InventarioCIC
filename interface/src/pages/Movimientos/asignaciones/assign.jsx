import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Componentes from "../../../components";
import axios from 'axios';
import {getFromLocalStorage} from '../../../context/Credentials';

const Peticion =()=>{
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });
  // Función para obtener los artículos desde la API
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
  const Asignar = async (formData) => {
    try {
      // Enviar los datos con el archivo al endpoint correspondiente
      const response = await instance.post(`/asignaciones/crearAsignacion`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de usar el tipo de contenido correcto
        },
      });
      return response.data; // Retorna los datos de la respuesta
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al crear la asignación');
    }
  };
  return {Asignar,ObtenerDetallesArticulo,ObtenerDetallesReponsable}
}

const ViewAssigned = () => {
  const { pkResponsable, pkArticulo } = useParams();
  const [ imagenes, setImagenes ] = useState();
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  const [blocked, setBlocked] = useState(null);
  const peticion = Peticion() 
  const navigate = useNavigate();
  // Función para obtener los detalles del responsable
  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null);
    navigate('/movimientos');
  };
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
      let datos = "";
      // Asegurarse de que `data.articulo.Condiciones` y `data.articulo.Condiciones[0].Imagenes` no sean null ni undefined
      if (data?.articulo?.Condiciones?.[0]?.Imagenes) {
        // Recorre las imágenes de manera segura
        for (let i = 0; i < data.articulo.Condiciones[0].Imagenes.length; i++) {
          // Verifica si la imagen no es null o undefined
          if (data.articulo.Condiciones[0].Imagenes[i]?.imagen) {
            // Almacena las imágenes válidas
            datos= datos+(data.articulo.Condiciones[0].Imagenes[i].imagen)+"<br>";
          }
        }
      }
      setImagenes(datos);
      if(data.articulo.responsable !== undefined){ setBlocked("Este Articulo ya esta asociado a un responsable") }
    } catch (error) {
      console.error("Error al obtener artículo:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadResponsable();
    loadArticulo();
  }, [pkResponsable, pkArticulo]);
  // Función para generar y enviar a imprimir el documento
  const generateAndPrint = async () => {
  if (!responsable || !articulo) {
    alert("Datos incompletos para generar el documento.");
    return;
  }

  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.toLocaleString("es-ES", { month: "long" });
  const año = fecha.getFullYear();
  const dataLocal = getFromLocalStorage()
  try {
    // Cargar el archivo HTML de formato
    const response = await fetch('/fromato.html');
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
      .replace('{{imagen1}}', imagenes)
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

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Por favor, selecciona un archivo antes de continuar.");
      return;
    }
    if (!responsable || !articulo) {
      setError("Datos incompletos del responsable o artículo.");
      return;
    }
    try {
      // Crear un FormData para enviar el archivo y los datos adicionales
      const formData = new FormData();
      formData.append("file", selectedFile); // Archivo seleccionado
      formData.append("fk_Articulo", articulo.pk); // ID del artículo
      formData.append("fk_Responsable", responsable.pk); // ID del responsable
      // Enviar la asignación con los datos y archivo al backend
      const response = await peticion.Asignar(formData); // Usar la función de asignar que ya tienes
      if (response) {
        setSuccess("Asignación creada con éxito.");
      } else {
        setError("Hubo un error al crear la asignación.");
      }
    } catch (error) {
      setError("Hubo un problema al guardar los datos. Inténtelo de nuevo.");
    }
  };
  if(blocked!==null)return(<Componentes.Modals.error mensaje={blocked} action={()=>{navigate("/asignaciones/")}}/>)
  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text={"Importación de responsiva - (asignación)"} />
      <div className="bg-white shadow-md rounded-md p-6 w-full">
        <div className="mb-6">
          <Componentes.Inputs.TitleSubtitle
            titulo={"Presentación de documento de asignación"}
            contenido={"Verifique que el documento sea correcto y suba el documento firmado por las partes."}
          />
        </div>
          <Componentes.Botones.Imprimir 
            text={"hola"}
            onClick={generateAndPrint}
          />
        </div>

      {/* Campo de selección de archivo */}
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
        {/* Botón para terminar la asignación */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-6 py-3 rounded-md shadow hover:bg-red-600 w-full"
          >
            Terminar asignación
          </button>
        </div>



    <div>
      <h1>Vista de Asignación</h1>
      <div>
          <div>
            <button onClick={generateAndPrint}>
              Imprimir Documento de Asignación
            </button>
          </div>
      </div>
    </div>
    </>
  );
};

export default ViewAssigned;