import { useState, useEffect, Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import peticion from '../../services/articulosService';
import Componentes from '../../components';


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
  const [dataGrupos, setDataGrupos] = useState([]);
  const [grupo, setGrupo] = useState([]);
  //variables de modals
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  const [error, setError] = useState();
  const [bloqued, setBloqued] = useState(null);
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
        if(result.articulo.Grupos_pk)setGrupo(result.articulo.Grupos_pk)
        if(result.articulo.Condiciones.length > 0){
        setImagenes(result.articulo.Condiciones[0].Imagenes || []);}
        if (result.articulo.responsable != null) setBloqued('No se puede editar un artículo asociado a un responsable.');      } catch (err) {
        setError(err.message);
      }
    };
    const cargarGrupos = async () => {
      try {
        const grupos = await Peticion.GruposDisponibles("");
        setDataGrupos(grupos);
      }catch(err){
        setError(err.message);
      }
    };
    cargarArticulo();
    cargarGrupos();
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
    formData.append('grupo', grupo);
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
  if(bloqued!==null)return(<Componentes.Modals.error mensaje={bloqued} action={()=>{navigate("/articles")}}/>)
  return (
    <>
    <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
    <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
    <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
      
      <Componentes.Inputs.TitleHeader text={"Edición de un Artículo."}/>
      <Componentes.Inputs.TitleSubtitle
        titulo="Datos del Artículo" 
        contenido="Edita los campos para actualizar el Artículo."
      />
      {articulo ? (
        <form onSubmit={handleEdit} className="flex flex-col space-y-6">
          <Componentes.Labels.text Onchange={(value) =>setNo_inventario(value)} Value={no_inventario} Placeholder={"Numero de inventario"}/>
          <Componentes.Labels.text Onchange={(value) =>setNombre(value)} Value={nombre} Placeholder={"Nombre"}/>
          <Componentes.Labels.number Onchange={(value) =>setCosto(value)} Value={costo} Placeholder={"Costo"}/>
          <Componentes.Labels.area Onchange={(value) =>setDescripcion(value)} Value={descripcion} Placeholder={"Descripción"}/>
          <Componentes.Inputs.TitleSubtitle 
            titulo="Grupo (opcional) " 
            contenido="Seleccione un grupo para asociarlo a su articulo" 
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
              contenido="Active este campo si el Artículo puede dejar de servir con un uso apropiado."
            />
          </div>
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
          <Componentes.Inputs.TitleSubtitle
            titulo="Nota de Edición" 
            contenido="Las notas sirven para justificar el porqué se editó el artículo."
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
