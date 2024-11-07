import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Componentes from '../../components';

const peticion = () => {
  const section = "articulos";
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const ObtenerDetalles = async (no_inventario) => {
    try {
      const response = await instance.get(`/${section}/details/${no_inventario}`);
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
  const navigate = useNavigate();
  const { NoInventario } = useParams();
  const Peticion = peticion();
  const [articulo, setArticulo] = useState(null);
  const [error, setError] = useState();
  const [no_inventario, setNo_inventario] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [consumible, setConsumible] = useState(false);
  const [imagenes, setImagenes] = useState([]); // Para las imágenes actuales
  const [nuevasImagenes, setNuevasImagenes] = useState([]); // Para las nuevas imágenes
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
  };
  
  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(NoInventario);
        setArticulo(result.articulo);
        setNo_inventario(result.articulo.no_inventario);
        setNombre(result.articulo.nombre);
        setDescripcion(result.articulo.descripcion);
        setCosto(result.articulo.costo);
        setConsumible(result.articulo.consumible);
        setImagenes(result.articulo.Condiciones[0].Imagenes || []); // Guardamos las imágenes procesadas
      } catch (err) {
        setError(err.message);
      }
    };
    cargarArticulo();
  }, [NoInventario]);

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

  const handleEdit = async (e) => {
    e.preventDefault();
    if (articulo.responsable) {
      setError('No se puede editar un artículo asociado a un responsable.');
      return;
    }
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('no_inventario', no_inventario);
    formData.append('descripcion', descripcion);
    formData.append('costo', parseFloat(costo));
    formData.append('consumible', consumible ? 1 : 0);
    for (let i = 0; i < nuevasImagenes.length; i++) {
      formData.append('imagenes', nuevasImagenes[i]);
    }
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('pathimg', imagenes[i].imagen);
    }
    try {
      const success = await Peticion.EditarArticulo(formData, articulo.pk); // Actualiza el artículo en la base de datos
      setSuccess(success)
      //navigate('/articles'); // Redirige a la lista de artículos
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
    <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
    <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      <h1>Editar Artículo</h1>
      <Componentes.Information 
        titulo="Datos del artículo" 
        contenido="Edita los campos para actualizar el artículo."
      />
      {articulo ? (
        <form onSubmit={handleEdit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nomero de inventario"
            value={no_inventario}
            onChange={(e) => setNo_inventario(e.target.value)}
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
          <div className="flex justify-between items-center">
            <h1>Consumible</h1>
            <input
              type="checkbox"
              checked={consumible}
              onChange={() => setConsumible(prev => !prev)}
              className="p-2"
            />
          </div>

          {/* Muestra las imágenes actuales y permite agregar nuevas */}
          <Componentes.Upimagen.EditUpimagen
            object={nuevasImagenes}
            request={imagenes}
            ImageUpload={handleImageUpload}
            clikObjectDelete={handleImageDelete}
            clikRequestDelete={handleRequestImageDelete}
          />

          {/* Botones para cancelar o confirmar */}
          <div className="flex flex-row w-[100%] gap-4">
            <Componentes.Botones.botonCancelar 
              text="Cancelar" 
              onClick={() => navigate('/articulos')} 
            />
            <Componentes.Botones.botonConfirmarVerde 
              text="Confirmar" 
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
