import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import peticion from '../../services/responsablesService';
import Componentes from "../../components/";

const ViewResponsableLoad = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellido_p, setApellidoP] = useState('');
  const [apellido_m, setApellidoM] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 

  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  }; 
  const handleActionSuccess = () => {
    setSuccess(null); 
    navigate('/responsable'); // Redirige a la lista de responsables
  };
  const handleCancel = () => {
    navigate('/responsable'); // Redirige a la lista de responsables
  };

  // Función para manejar la publicación del responsable
  const handlePublish = (e) => {
    e.preventDefault();
    // Creamos el objeto con los datos del formulario
    const responsableData = {
      nombres,
      apellido_p,
      apellido_m,
      correo
    };

    // Llamamos a la API para publicar el responsable
    peticion().Publicar(responsableData)
      .then((result) => {
        setSuccess("Responsable creado con éxito.");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>

      <Componentes.Inputs.TitleHeader text={"Alta de un Responsable"}/>
      <Componentes.Inputs.TitleSubtitle titulo={"Datos de un responsable"} 
        contenido={"Rellene todos los campos para poder crear un Responsable."}/>

      <form onSubmit={handlePublish} className="space-y-6">
        <Componentes.Labels.text 
          Value={nombres} 
          Onchange={(value) => setNombres(value)} 
          Placeholder={"Nombres"}
        />
        <Componentes.Labels.text 
          Value={apellido_p} 
          Onchange={(value) => setApellidoP(value)} 
          Placeholder={"Apellido paterno"}
        />
        <Componentes.Labels.text 
          Value={apellido_m} 
          Onchange={(value) => setApellidoM(value)} 
          Placeholder={"Apellido materno"}
        />
        <Componentes.Labels.correo 
          Value={correo} 
          Onchange={(value) => setCorreo(value)} 
          Placeholder={"Correo"}
        />

        <div className="flex flex-row w-[100%] gap-4">
          <Componentes.Botones.Cancelar text={"Cancelar"} onClick={handleCancel}/>
          <Componentes.Botones.ConfirmarVerde text={"Confirmar"}/>
        </div>
      </form>
    </>
  );
};

export default ViewResponsableLoad;
