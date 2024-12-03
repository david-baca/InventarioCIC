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
  const { pkResponsable, pkArticulo } = useParams();
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para obtener los detalles del responsable
  const loadResponsable = async () => {
    setLoading(true);
    try {
      const data = await obtenerResponsable(pkResponsable);
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
      const data = await obtenerArticulo(pkArticulo);
      setArticulo(data.articulo);
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
  const generateAndPrint = () => {
    if (!responsable || !articulo) {
      alert("Datos incompletos para generar el documento.");
      return;
    }

    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("es-ES", { month: "long" });
    const año = fecha.getFullYear();

    // Crear una nueva ventana para el contenido HTML
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Escribir el contenido del documento en la nueva ventana
    printWindow.document.write(`
      <html>
        <head>
          <title>Asignación de Artículo</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 20px;
            }
            h1 {
              text-align: center;
            }
            .content {
              margin-top: 20px;
            }
            .section {
              margin-top: 10px;
            }
            .footer {
              position: absolute;
              bottom: 20px;
              width: 100%;
              text-align: center;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>Asignación de Artículo</h1>
          <div class="content">
            <p><strong>ASUNTO:</strong> ASIGNACION DE ARTICULO</p>
            <p>Cancún, Quintana Roo, a ${dia} de ${mes} de ${año}.</p>
            <p><strong>Nombre:</strong> ${responsable.nombres}</p>
            <p><strong>Cargo:</strong> ${responsable.cargo}</p>
            <p><strong>PRESENTE:</strong></p>
            <p>Por medio de la presente se hace constar la asignación de artículos de inventario entre las siguientes partes:</p>

            <div class="section">
              <p><strong>Responsable de asignación:</strong> _________.</p>
              <p><strong>Asignado a:</strong> ${responsable.nombres}.</p>
            </div>

            <div class="section">
              <p><strong>DECLARACIONES</strong></p>
              <p><strong>Primera:</strong> El responsable de la asignación declara que los artículos asignados se encuentran en el estado que a continuación se detalla y son entregados al asignado en calidad de préstamo o asignación temporal, conforme a las políticas de la empresa.</p>
              <p><strong>Segunda:</strong> El asignado se compromete a hacer uso responsable de los artículos asignados, garantizando su buen estado de conservación, salvo por el desgaste normal derivado del uso.</p>
            </div>

            <div class="section">
              <p><strong>CLÁUSULAS</strong></p>
              <p><strong>Primera:</strong> Se acuerda la asignación de los siguientes artículos, cuyo estado y condiciones se detallan a continuación.</p>
              <p><strong>Segunda:</strong> El responsable de la asignación garantiza que los artículos se encuentran en el estado declarado al momento de la entrega.</p>
              <p><strong>Tercera:</strong> El asignado se compromete a utilizar los artículos asignados de acuerdo con su propósito y a reportar cualquier inconveniente o deterioro.</p>
              <p><strong>Cuarta:</strong> El asignado se compromete a devolver los artículos en las mismas condiciones en que fueron recibidos, salvo por el desgaste normal. La devolución deberá realizarse al responsable de la asignación o en el área designada.</p>
            </div>

            <div class="section">
              <p><strong>DETALLES DEL ARTÍCULO</strong></p>
              <p><strong>No. Inventario:</strong> ${articulo.no_inventario}</p>
              <p><strong>Nombre:</strong> ${articulo.nombre}</p>
              <p><strong>Descripción:</strong> ${articulo.descripcion}</p>
              <p><strong>Precio:</strong> ${articulo.precio}</p>
            </div>

            <div class="section">
              <p><strong>EVIDENCIAS ADJUNTAS</strong></p>
              <p><strong>Fotos:</strong></p>
              <p>${articulo.imagenes ? articulo.imagenes.map(img => <img src="${img}" alt="Imagen del artículo" style="width: 100px; height: 100px; margin: 5px;" />).join('') : "No hay fotos disponibles."}</p>
            </div>
          </div>
          <div class="footer">
            <p>Firma del Responsable: _________</p>
            <p>Firma del Asignado: _________</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close(); // Cerrar el documento para que pueda renderizarse

    // Esperar a que la página se haya cargado completamente antes de imprimir
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div>
      <h1>Vista de Asignación</h1>
      <div>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div>
            <button onClick={generateAndPrint}>
              Imprimir Documento de Asignación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAssigned;