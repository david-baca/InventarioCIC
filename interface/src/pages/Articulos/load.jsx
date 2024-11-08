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
  const [error, setError] = useState(null);
  const Peticion = peticion();
  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (imagenes.length + files.length > 5) {
      alert("No puedes cargar más de 5 imágenes.");
      return;
    }
    setImagenes([...imagenes, ...files]);
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
      <h1>Carga de Artículo</h1>
      <Componentes.Inputs.TitleHeader text={"Datos de un articulo"} 
        contenido={"Rellene todos los campos para poder crear un articulo. "}/>
      <form onSubmit={handlePublish} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="No. Inventario"
          value={noInventario}
          onChange={(e) => setNoInventario(e.target.value)}
          required
          className="p-2"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="p-2"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="p-2"
        />
        <input
          type="number"
          placeholder="Costo"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          required
          className="p-2"
        />
        <div className='flex justify-between items-center'>
          <h1>Consumible</h1>
          <input
            type="checkbox"
            checked={consumible}
            onChange={() => setConsumible(prev => !prev)}
            className="p-2"
          />
        </div>
        {/* Pass image delete handler to Upimagen */}
        <Componentes.Upimagen.Upimagen images={imagenes} ImageUpload={handleImageUpload} clikDelete={handImageDelete}/>
        <div className='flex flex-row w-[100%] gap-4'>
          <Componentes.Botones.Cancelar text={"Cancelar"} onClick={handleCancel}/>
          <Componentes.Botones.ConfirmarVerde text={"Confirmar"}/>
        </div>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </>
  );
};

export default ViewArticleLoad;
