import { useState, useEffect, Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Componentes from '../../components';

const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({baseURL: baseApi});
  const ObtenerDetalles = async (no_inventario) => {
    try {
      const response = await instance.get(`/${section}/details/${encodeURIComponent(no_inventario)}`);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };
  const EditarArticulo = async (data, id) => {
    try {
      const response = await instance.put(`/${section}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la interacción con la API');
    }
  };
  return { ObtenerDetalles, EditarArticulo };
};

const ViewArticleEdit = () => {
  //variables config
  const navigate = useNavigate();
  const { pk } =  useParams();
  const Peticion = peticion();
  //variables form
  const [articulo, setArticulo] = useState(null);
  const [no_inventario, setNo_inventario] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [motivo, setMotivo] = useState('');
  const [costo, setCosto] = useState('');
  const [consumible, setConsumible] = useState(false);
  const [imagenes, setImagenes] = useState([]); // Para las imágenes actuales
  const [nuevasImagenes, setNuevasImagenes] = useState([]); // Para las nuevas imágenes
  //variables de modals
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  const [error, setError] = useState();
  //funciones modal
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
  //carga de datos
  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setArticulo(result.articulo);
        setNo_inventario(result.articulo.no_inventario);
        setNombre(result.articulo.nombre);
        setDescripcion(result.articulo.descripcion);
        setCosto(result.articulo.costo);
        setConsumible(result.articulo.consumible);
        if(result.articulo.Condiciones.length > 0){
        setImagenes(result.articulo.Condiciones[0].Imagenes || []);}
        if (result.articulo.responsable != null) setError('No se puede editar un artículo asociado a un responsable.');      } catch (err) {
        setError(err.message);
      }
    };
    cargarArticulo();
  }, [pk]);
  // Manejo de imágenes nuevas (cargadas localmente)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (nuevasImagenes.length + imagenes.length + files.length > 5) {
      setShowInfo("No puedes cargar más de 5 imágenes.");
      return;
    }
    setNuevasImagenes(prev => [...prev, ...files]);
  };
  // Eliminar imágenes cargadas localmente
  const handleImageDelete = (index) => {
    setNuevasImagenes(prev => prev.filter((_, i) => i !== index));
  };
  // Eliminar imágenes ya cargadas en el servidor
  const handleRequestImageDelete = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };
  //envio de datos form
  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('no_inventario', no_inventario);
    formData.append('descripcion', descripcion);
    formData.append('costo', parseFloat(costo));
    formData.append('consumible', consumible ? 1 : 0);
    formData.append('motivo', motivo);
    for (let i = 0; i < nuevasImagenes.length; i++) {
      formData.append('imagenes', nuevasImagenes[i]);
    } 
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('pathimg', imagenes[i].imagen);
    }
    try {
      const success = await Peticion.EditarArticulo(formData, articulo.pk); // Actualiza el artículo en la base de datos
      setSuccess(success.message)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
    <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
    <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      
      <Componentes.Inputs.TitleHeader text={"Edicion de un Articulo."}/>
      <Componentes.Inputs.TitleSubtitle
        titulo="Datos del artículo" 
        contenido="Edita los campos para actualizar el artículo."
      />
      {articulo ? (
        <form onSubmit={handleEdit} className="flex flex-col space-y-4 gap-3">
          <Componentes.Labels.text Onchange={(value) =>setNo_inventario(value)} Value={no_inventario} Placeholder={"Numero de inventario"}/>
          <Componentes.Labels.text Onchange={(value) =>setNombre(value)} Value={nombre} Placeholder={"Nombre"}/>
          <Componentes.Labels.number Onchange={(value) =>setCosto(value)} Value={costo} Placeholder={"Costo"}/>
          <Componentes.Labels.area Onchange={(value) =>setDescripcion(value)} Value={descripcion} Placeholder={"Descripción"}/>
          <div className="flex items-center p-5 gap-5">
            <Componentes.Labels.checkbox Value={consumible}
              Onchange={(value) =>setConsumible(value)}
            />
            <Componentes.Inputs.TitleSubtitle
              titulo="Articulo consumible" 
              contenido="Active este campo si el artículo puede dejar de servir con un uso apropiado."
            />
          </div>
          <Componentes.Inputs.TitleSubtitle 
            titulo="Evidencias (opcional)" 
            contenido="Nos ayuda a registrar las condiciones actuales del articulo" 
          />
          <Componentes.Labels.fileimg
            object={nuevasImagenes}
            request={imagenes}
            ImageUpload={handleImageUpload}
            clikObjectDelete={handleImageDelete}
            clikRequestDelete={handleRequestImageDelete}
          />
          <Componentes.Inputs.TitleSubtitle
            titulo="Nota de edicion" 
            contenido="Las notas de edicion son campos para comentar el porque se edita un registro"
          />
          <Componentes.Labels.area Onchange={(value) =>setMotivo(value)} Value={motivo} Placeholder={"Motivo"}/>
          {/* Botones para cancelar o confirmar */}
          <div className="flex flex-row w-[100%] gap-4">
            <Componentes.Botones.Cancelar
              text="Cancelar" 
              onClick={() => navigate('/articles')} 
            />
            <Componentes.Botones.ConfirmarVerde
              text={"Confirmar"} 
            />
          </div>
        </form>
      ) : (
        <div>Cargando detalles del artículo...</div>
      )}
    </>
  );
};

export default ViewArticleEdit;
