import { useState } from 'react';
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
  return { Publicar };
};

const ViewArticleLoad = () => {
  const navigate = useNavigate();
  const [noInventario, setNoInventario] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [consumible, setConsumible] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  
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
  const Peticion = peticion();
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
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }
    try {
      const result = await Peticion.Publicar(formData);
      console.log('Published:', result);
      navigate('/articles');
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
      <Componentes.Inputs.TitleSubtitle titulo={"Datos de un articulo"} 
        contenido={"Rellene todos los campos para poder crear un articulo. "}/>
      <form onSubmit={handlePublish} className="flex flex-col space-y-4 gap-3">
        <Componentes.Labels.text Value={noInventario} Onchange={(value) => setNoInventario(value)} Placeholder={"No. Inventario"}/>
        <Componentes.Labels.text Value={nombre} Onchange={(value) => setNombre(value)} Placeholder={"Nombre"}/>
        <Componentes.Labels.number Value={costo} Onchange={(value) => setCosto(value)} Placeholder={"Costo"}/>
        <Componentes.Labels.area Value={descripcion} Onchange={(value) => setDescripcion(value)} Placeholder={"Descripción"}/>
        <div className="flex items-center p-5 gap-5">
            <Componentes.Labels.checkbox Value={consumible}
              Onchange={(value) =>setConsumible(value)}
            />
            <Componentes.Inputs.TitleSubtitle
              titulo="Articulo consumible" 
              contenido="Active este campo si el artículo puede dejar de servir con un uso apropiado."
            />
        </div>
        {/* Pass image delete handler to Upimagen */}
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
