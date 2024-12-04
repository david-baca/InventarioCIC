import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [ imagenes, setImagenes ] = useState();
  const [responsable, setResponsable] = useState(null);
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(false);
  const peticion = Peticion() 
  // Función para obtener los detalles del responsable
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
      console.log(datos)
      // Asigna el array de imágenes a un estado o variable
      setImagenes(datos);
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

  try {
    // Cargar el archivo HTML de formato
    const response = await fetch('/fromato.html');
    const htmlText = await response.text();

    // Reemplazar las variables dinámicas en el archivo HTML
    let formattedHtml = htmlText
      .replace('{{fecha}}', `${dia} de ${mes} de ${año}`)
      .replace('{{nombre}}', responsable.nombres)
      .replace('{{cargo}}', responsable.cargo)
      .replace('{{responsable}}', responsable.nombres)  // O el nombre del responsable de la asignación
      .replace('{{asignado}}', responsable.nombres)    // Asignado
      .replace('{{no_inventario}}', articulo.no_inventario)
      .replace('{{nombre_articulo}}', articulo.nombre)
      .replace('{{descripcion}}', articulo.descripcion)
      .replace('{{precio}}', articulo.precio)
      .replace('{{imagen1}}', imagenes);

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