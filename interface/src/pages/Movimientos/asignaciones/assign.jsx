import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Componentes from "../../../components";
import axios from "axios";

const Peticion = () => {
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
      throw new Error(error.response?.data?.error || "Error al obtener el artículo");
    }
  };

  const ObtenerDetallesReponsable = async (id) => {
    try {
      const response = await instance.get(`/responsables/details/${id}`);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Error al obtener el responsable");
    }
  };

  const AsignarDocumento = async (fileData) => {
    try {
      const response = await instance.post(`/asignaciones/subirDocumento`, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Error al subir el documento");
    }
  };

  return { ObtenerDetallesArticulo, ObtenerDetallesReponsable, AsignarDocumento };
};

const ViewAssigned = () => {
  const { pkResponsable, pkArticulo } = useParams();
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [imagenes, setImagenes] = useState("");
  const [loading, setLoading] = useState(false);
  const peticion = Peticion();

  const loadResponsable = async () => {
    try {
      const data = await peticion.ObtenerDetallesReponsable(pkResponsable);
      setResponsable(data.responsable);
    } catch (error) {
      console.error("Error al obtener responsable:", error);
    }
  };

  const loadArticulo = async () => {
    try {
      const data = await peticion.ObtenerDetallesArticulo(pkArticulo);
      setArticulo(data.articulo);

      let imagenesHTML = "";
      if (data?.articulo?.Condiciones?.[0]?.Imagenes) {
        for (let img of data.articulo.Condiciones[0].Imagenes) {
          if (img?.imagen) {
            imagenesHTML += `<img src="${img.imagen}" alt="Imagen artículo" style="max-width:100%"/><br>`;
          }
        }
      }
      setImagenes(imagenesHTML);
    } catch (error) {
      console.error("Error al obtener artículo:", error);
    }
  };

  useEffect(() => {
    loadResponsable();
    loadArticulo();
  }, [pkResponsable, pkArticulo]);

  const handleFileChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!archivo) {
      alert("Por favor, seleccione un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("responsableId", pkResponsable);
    formData.append("articuloId", pkArticulo);

    setLoading(true);
    try {
      await peticion.AsignarDocumento(formData);
      alert("Archivo subido exitosamente");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAndPrint = async () => {
    if (!responsable || !articulo) {
      alert("Datos incompletos para generar el documento.");
      return;
    }

    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("es-ES", { month: "long" });
    const año = fecha.getFullYear();

    try {
      const response = await fetch("/fromato.html");
      const htmlText = await response.text();

      let formattedHtml = htmlText
        .replace("{{fecha}}", `${dia} de ${mes} de ${año}`)
        .replace("{{nombre}}", responsable.nombres)
        .replace("{{cargo}}", responsable.cargo)
        .replace("{{no_inventario}}", articulo.no_inventario)
        .replace("{{nombre_articulo}}", articulo.nombre)
        .replace("{{descripcion}}", articulo.descripcion)
        .replace("{{precio}}", articulo.precio)
        .replace("{{imagenes}}", imagenes);

      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(formattedHtml);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    } catch (err) {
      console.error("Error al generar el documento:", err);
    }
  };

  return (
    <div className="p-6">
      <Componentes.Inputs.TitleHeader text={"Importación de Responsiva - Asignación"} />

      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Presentación de documento de asignación</h2>
        <div className="flex items-center justify-between mb-6">
          <div>
            <label htmlFor="fileInput" className="cursor-pointer bg-gray-300 px-4 py-2 rounded-md shadow text-gray-700">
              Examinar...
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="ml-4 text-gray-500">
              {archivo ? archivo.name : "No se ha seleccionado ningún archivo"}
            </span>
          </div>
          <button onClick={generateAndPrint} className="bg-orange-500 text-white px-4 py-2 rounded-md shadow hover:bg-orange-600">
            Descargar PDF
          </button>
        </div>
        <button
          className="bg-red-500 text-white w-full py-3 rounded-md shadow hover:bg-red-600"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Subiendo archivo..." : "Terminar asignación"}
        </button>
      </div>

      {/* <button
        onClick={generateAndPrint}
        className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
      >
        Imprimir Documento de Asignación
      </button> */}
    </div>
  );
};

export default ViewAssigned;
