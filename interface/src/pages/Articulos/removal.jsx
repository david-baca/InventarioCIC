import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Componentes from "../../components/";

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
  const EliminarArticulo = async (id, data) => {
    try {
      const response = await instance.patch(`/${section}/baja/${id}`, data,);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en API interaction');
    }
  };
  return { ObtenerDetalles, EliminarArticulo };
};

const ViewArticleRenoval = () => {
  //config
  const Peticion = useMemo(() => peticion(), []);
  const navigate = useNavigate();
  const { pk } = useParams();
  const [articulo, setArticulo] = useState(null);
  //variables form
  const [motivo, setMotivo] = useState('');
  const [imagenes, setImagenes] = useState([]); // Para las imágenes actuales
  const [nuevasImagenes, setNuevasImagenes] = useState([]); // Para las nuevas imágenes
  //variables de modals
  const [bloqued, setBloqued] = useState(null);
  const [showInfo, setShowInfo] = useState();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  //funciones modal
  const handleActionInfo = () => setShowInfo(null);
  const handleActionEror = () =>{ setError(null); }
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('/articles');
  };
  //Carga de datos
  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setArticulo(result.articulo);
        if(result.articulo.Condiciones.length > 0){
        setImagenes(result.articulo.Condiciones[0].Imagenes || []);}
        if (result.articulo.responsable != null) setBloqued('No se puede dar de baja a un artículo asociado a un responsable.');      
      } catch (err) {
        setError(err.message);
      }
    };
    cargarArticulo();
  },[pk, Peticion]);
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
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    const formData = new FormData();
    for (let i = 0; i < nuevasImagenes.length; i++) {
      formData.append('imagenes', nuevasImagenes[i]);
    } 
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('pathimg', imagenes[i].imagen);
    }
    formData.append('motivo', motivo);
    try {
      const result = await Peticion.EliminarArticulo(articulo.pk, formData)
      setSuccess('Artículo dado de baja. Exitoso');
    } catch (err) {
      setError(err.message);
    }
  };
  if(bloqued!==null)return(<Componentes.Modals.error mensaje={bloqued} action={()=>{navigate("/articles")}}/>)
  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text="Eliminación de un Artículo" />
      {articulo === null ? (
        <div>Cargando detalles del artículo...</div>
      ) : (
        <div className="gap-10 flex flex-col">
          <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
            <Componentes.Inputs.TitleSubtitle 
              titulo="Los motivos de eliminación son campos para comentar el porqué se elimina un registro." 
              contenido="Motivo de eliminación" 
            />
            <Componentes.Labels.area 
              Onchange={(value) => setMotivo(value)} 
              Value={motivo} 
              Placeholder="Motivo de eliminación" 
            />
            <Componentes.Inputs.TitleSubtitle 
              titulo="Evidencias (opcional)" 
              contenido="Nos ayuda a registrar las condiciones actuales del Artículo" 
            />
            <Componentes.Labels.fileimg
              object={nuevasImagenes}
              request={imagenes}
              ImageUpload={handleImageUpload}
              clikObjectDelete={handleImageDelete}
              clikRequestDelete={handleRequestImageDelete}
            />
            <div className="flex flex-row w-[100%] gap-4">
              <Componentes.Botones.Cancelar text="Cancelar" onClick={() => navigate('/articles')} />
              <Componentes.Botones.ConfirmarRojo text="Confirmar"/>
            </div>
          </form>
          <Componentes.Inputs.TitleSubtitle 
            titulo={`Eliminación del responsable ${articulo.responsable ? articulo.responsable.nombre : 'Desconocido'}`} 
            contenido={`Yo, [user name], en mi calidad de Administrador, declaro que en fecha ${new Date().toLocaleDateString()} se procede a dar de baja el responsable ${articulo.responsable ? articulo.responsable.nombre : 'Desconocido'}. Esta decisión se toma debido a [${motivo}], lo que impide su seguimiento en esta institución.`} 
          />
        </div>
      )}
    </>
  );
};

export default ViewArticleRenoval;

