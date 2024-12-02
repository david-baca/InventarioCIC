import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import Componentes from "../../../components";
import axios from 'axios';

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
      const response = await instance.post(`/asignaciones/crearAsignacion`, formData);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error al obtener los detalles del responsable');
    }
  };

  const urlToImage= async(url)=> {
    try {
      const response = await axios.get(url, { responseType: 'blob' }); // Obtener la imagen como Blob
      const reader = new FileReader();
  
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);  // `reader.result` contiene la imagen en base64
        };
        reader.onerror = (error) => reject(error);
  
        reader.readAsDataURL(response.data); // Convertir el Blob a base64
      });
    } catch (error) {
      console.error('Error al obtener la imagen: ', error);
      return null;
    }
  };
  return {Asignar,ObtenerDetallesArticulo, ObtenerDetallesReponsable, urlToImage}
}


const ViewAssigned = () => {
  const { pkResponsable, pkArticulo } = useParams(); // Obtener parámetros de la URL
  const peticones = Peticion()
  const navigate = useNavigate(); // Redirección
  const [imagen, setImagen] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadResponsables = async () => {
      setError(null);
      try {
        const data = await peticones.ObtenerDetallesReponsable(pkResponsable);
        setResponsable(data.responsable);
      } catch (err) {
        setError("No se pudieron cargar los responsables.");
      }
    };
    const loadArticulos = async () => {
      setError(null);
      try {
        const data = await peticones.ObtenerDetallesArticulo(pkArticulo);
        setArticulo(data.articulo);
      } catch (err) {
        setError("No se pudieron cargar los articulos.");
      }
    };
    loadResponsables()
    loadArticulos()
  },[pkResponsable, pkArticulo]);

  // Generar y descargar el documento
  const generateAndDownloadDocument = async () => {
    if (!responsable || !articulo) {
      alert("Datos incompletos para generar el documento.");
      return;
    }

    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("es-ES", { month: "long" });
    const año = fecha.getFullYear();

    try {
      const response = await fetch("/FORMATO DE ASIGNACION - MODULO DE REPORTES.docx");
      if (!response.ok) throw new Error("No se pudo cargar la plantilla.");

      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      doc.setData({
        dia,
        mes,
        año,
        "responsable.nombres": `${responsable.nombres}${responsable.apellido_p}${responsable.apellido_m}`,
        "no_inventario": articulo.no_inventario || "",
        "nombre": articulo.nombre || "",
        "descripcion": articulo.descripcion || "",
        "costo": parseFloat(articulo.costo || 0).toFixed(2),
        "imagen1": "{imagen1}"
      });

      doc.render();
      const out = doc.getZip().generate({ type: "blob" });
      saveAs(out, `Asignacion_${responsable.nombres}_${articulo.no_inventario}.docx`);

      // Ahora llamar a la función para convertir el archivo Word a PDF
      await convertWordToPdf(out);
    } catch (error) {
      console.error("Error al generar el documento:", error);
      alert("Hubo un problema al generar el documento. Inténtelo de nuevo.");
    }
  };

   // Función para convertir el archivo Word a PDF usando la API de iLovePDF
   const convertWordToPdf = async (wordBlob) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", wordBlob, "FORMATO DE ASIGNACION - MODULO DE REPORTES.docx");

      // El endpoint de la API de iLovePDF
      const apiKey = "project_public_18d8cf2f66627f182b1bf856b53bde47_VZbOJ03448e676545ea468e11bb7a0ff7da12"; // Reemplaza con tu API Key de iLovePDF
      const url = "https://api.ilovepdf.com/v1/convert/word_to_pdf"; // Endpoint de iLovePDF para convertir Word a PDF

      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      if (response.status === 200) {
        const pdfBlob = response.data;
        saveAs(pdfBlob, `Asignacion_${responsable.nombres}_${articulo.no_inventario}.pdf`);
      } else {
        throw new Error("Error al convertir el archivo Word a PDF.");
      }
    } catch (error) {
      console.error("Error al convertir a PDF:", error);
      alert("Hubo un problema al convertir el archivo. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  

  // Manejar la selección de archivo para subir
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

 // Manejar la subida de archivos y la creación de asignación
// Manejar la subida de archivos y la creación de asignaciones
const handleSubmit = async () => {
  if (!selectedFile) {
    alert("Por favor, selecciona un archivo antes de continuar.");
    return;
  }

  if (!responsable || !articulo) {
    alert("Datos incompletos del responsable o artículo.");
    return;
  }

  try {
    // Crear un FormData para enviar el archivo y los datos adicionales
    const formData = new FormData();
    console.log(selectedFile)
    formData.append("file", selectedFile); // Archivo seleccionado
    formData.append("fk_Articulo", articulo.pk); // ID del artículo
    formData.append("fk_Responsable", responsable.pk); // ID del responsable
    const result =await peticones.Asignar(formData)
    //Setsuccess
  } catch (error) {
    console.error("Error al subir el archivo o crear la asignación:", error);
    alert("Hubo un problema al procesar la solicitud. Intente nuevamente.");
  }
};

  return (
    <>
       <Componentes.Inputs.TitleHeader text={"Importación de responsiva - (asignación)"} />
      <div className="bg-white shadow-md rounded-md p-6 w-full">
        <div className="mb-6">
          <Componentes.Inputs.TitleSubtitle
            titulo={"Presentación de documento de asignación"}
            contenido={"Verifique que el documento sea correcto y suba el documento firmado por las partes."}
          />
        </div>

         {/* Botón de descarga */}
         <div className="flex justify-between items-center mb-6 w-full">
          <p className="text-gray-700 font-semibold">
            Archivo: {selectedFile ? selectedFile.name : "No se ha seleccionado ningún archivo"}
          </p>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md shadow hover:bg-orange-600"
            onClick={generateAndDownloadDocument}
            disabled={loading}
          >
            {loading ? "Generando PDF..." : "Descargar PDF"}
          </button>
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
      </div>

      {/* Vista previa del archivo */}
      {/* {selectedFile && (
        <div className="mt-6 w-full bg-gray-100 p-4 rounded-md shadow">
          <embed
            src={URL.createObjectURL(selectedFile)}
            type="application/pdf"
            className="w-full h-[500px] border rounded-md"
          />
        </div>
      )} */}
    </>
  );
};

export default ViewAssigned;
