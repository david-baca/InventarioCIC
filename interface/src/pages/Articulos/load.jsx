import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Componentes from "../../components/";

const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });
  const Publicar = async (data) => {
    try {
      const response = await instance.post(`/${section}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };
  const GruposDisponibles = async (query) => {
    try {
      const response = await instance.get(`/grupos/${encodeURIComponent(query)}`);
      return response.data.grupos; // Ajusta según la respuesta esperada
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error en la búsqueda de grupos');
    }
  };
  return { Publicar, GruposDisponibles };
};

const ViewArticleLoad = () => {
  const navigate = useNavigate();
  const [noInventario, setNoInventario] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [consumible, setConsumible] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [dataGrupos, setDataGrupos] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  const Peticion = peticion();
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const grupos = await Peticion.GruposDisponibles("");
        setDataGrupos(grupos);
      }catch(err){
        setError(err.message);
      }
    };
    cargarGrupos();
  }, []);

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
    navigate('/articles');
  }
  // Handle form submission
  const handlePublish = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('no_inventario', noInventario);
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('costo', parseFloat(costo));
    formData.append('consumible', consumible ? 1 : 0);
    formData.append('grupo', grupo);
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }
    try {
      const result = await Peticion.Publicar(formData);
      setSuccess("artculo exitosamente dado de alta.")
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <Componentes.Inputs.TitleHeader text={"Alta de Artículo"}/>
      <Componentes.Inputs.TitleSubtitle titulo={"Datos de un artículo"} 
        contenido={"Rellene todos los campos para poder crear un artículo. "}/>
      <form onSubmit={handlePublish} className="flex flex-col space-y-6">
        <Componentes.Labels.text Value={noInventario} Onchange={(value) => setNoInventario(value)} Placeholder={"No. Inventario"}/>
        <Componentes.Labels.text Value={nombre} Onchange={(value) => setNombre(value)} Placeholder={"Nombre"}/>
        <Componentes.Labels.number Value={costo} Onchange={(value) => setCosto(value)} Placeholder={"Costo"}/>
        <Componentes.Labels.area Value={descripcion} Onchange={(value) => setDescripcion(value)} Placeholder={"Descripción"}/>
        <Componentes.Inputs.TitleSubtitle 
          titulo="Grupo (opcional) " 
          contenido="Seleccione un grupo para asociarlo a su artículo" 
        />
        <Componentes.Labels.select 
          List={dataGrupos} 
          Placeholder={"Secciona un grupo"} 
          setValue={(i)=>{setGrupo(i)}}
          Value={grupo}
        />
        <div className="flex items-center p-5 gap-5">
            <Componentes.Labels.checkbox Value={consumible}
              Onchange={(value) =>setConsumible(value)}
            />
            <Componentes.Inputs.TitleSubtitle
              titulo="Artículo consumible" 
              contenido="Active este campo si el artículo puede dejar de servir con un uso apropiado."
            />
        </div>
        {/* Pass image delete handler to Upimagen */}
        <Componentes.Inputs.TitleSubtitle 
          titulo="Evidencias (opcional) " 
          contenido="Nos ayuda a registrar las condiciones actuales del Artículo" 
        />
        <Componentes.Labels.fileimg
            object={imagenes}
            ImageUpload={handleImageUpload}
            clikObjectDelete={handImageDelete}
        />
        <div className='flex flex-row w-[100%] gap-4'>
          <Componentes.Botones.Cancelar text={"Cancelar"} onClick={handleCancel}/>
          <Componentes.Botones.ConfirmarVerde text={"Confirmar"}/>
        </div>
      </form>
    </>
  );
};

export default ViewArticleLoad;
