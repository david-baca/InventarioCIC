import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import Componentes from "../../../components";


const ViewAssigned = () => {
  const { pkResponsable, pkArticulo } = useParams(); // Obtener parámetros de la URL
  const navigate = useNavigate(); // Redirección
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const selectedResponsable = JSON.parse(localStorage.getItem("selectedResponsable"));
    const selectedArticle = JSON.parse(localStorage.getItem("selectedArticle"));

    if (selectedResponsable && selectedArticle) {
      setResponsable(selectedResponsable);
      setArticulo(selectedArticle);
    } else {
      alert("Faltan datos del responsable o artículo. Redirigiendo...");
      navigate("/asignaciones/responsableSelect"); // Redirige a la selección inicial si no hay datos
    }
  }, [navigate]);

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
        "costo": parseFloat(articulo.costo || 0).toFixed(2), // Convertir costo a número
      });
  
      doc.render();
      const out = doc.getZip().generate({ type: "blob" });
      saveAs(out, `Asignacion_${responsable.nombres}_${articulo.no_inventario}.docx`);
    } catch (error) {
      console.error("Error al generar el documento:", error);
      alert("Hubo un problema al generar el documento. Inténtelo de nuevo.");
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
    formData.append("file", selectedFile); // Archivo seleccionado
    formData.append("fk_Articulo", articulo.pk); // ID del artículo
    formData.append("fk_Responsable", responsable.pk); // ID del responsable

    const response = await fetch("http://localhost:3720/asignaciones/crearAsignacion", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al subir el archivo o crear la asignación.");
    }

    const result = await response.json();
    alert("Asignación creada exitosamente.");
    navigate("/asignaciones/completado"); // Redirige al completar la asignación
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
          >
            Descargar
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
            onChange={handleFileSelect}
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
            className="bg-red-500 text-white px-6 py-3 rounded-md shadow hover:bg-red-600 w-full" // Botón ocupa todo el ancho
          >
            Terminar asignación
          </button>
        </div>
      </div>

      {/* Vista previa del archivo */}
      {selectedFile && (
        <div className="mt-6 w-full bg-gray-100 p-4 rounded-md shadow">
          <embed
            src={URL.createObjectURL(selectedFile)}
            type="application/pdf"
            className="w-full h-[500px] border rounded-md"
          />
        </div>
      )}
    </>
  );
};

export default ViewAssigned;
