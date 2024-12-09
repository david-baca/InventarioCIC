import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import peticion from '../../services/responsablesService';
import Componentes from "../../components/";

const ViewResponsableEdit = () => {
  const navigate = useNavigate();
  const { pk } = useParams(); // Obtener el ID del responsable desde la URL
  const Peticion = peticion();
  const [motivo, setMotivo] = useState('');

  // Estados para los campos del formulario
  const [responsable, setResponsable] = useState({
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
  });  
  // Funciones de modal
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState();

  // Manejo de errores y éxito de la acción
  const handleActionInfo = () => { setShowInfo(null); };
  const handleActionError = () => { setError(null); };
  const handleActionSuccess = () => { setSuccess(null); navigate('/responsable'); };

  // Cargar los detalles del responsable
  useEffect(() => {
    const cargarResponsable = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setResponsable(result.responsable);
      } catch (err) {
        setError(err.message);
      }
    };
    cargarResponsable();
  }, [pk]);

  // Manejar el formulario de edición
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const result = await Peticion.EditarResponsable(pk, {motivo, ...responsable});
      setSuccess(result.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo} />
      <Componentes.Modals.error mensaje={error} action={handleActionError} />

      <Componentes.Inputs.TitleHeader text={"Editar Responsable"} />
      <Componentes.Inputs.TitleSubtitle
        titulo="Datos del responsable"
        contenido="Edita los campos para actualizar la información del responsable."
      />

      <form onSubmit={handleEdit} className="space-y-6">
        {/* Nombres */}
        <Componentes.Labels.text
          Value={responsable.nombres}
          Onchange={(value) => setResponsable({ ...responsable, nombres: value })}
          Placeholder={"Nombres"}
        />

        {/* Apellido Paterno */}
        <Componentes.Labels.text
          Value={responsable.apellido_p}
          Onchange={(value) => setResponsable({ ...responsable, apellido_p: value })}
          Placeholder={"Apellido Paterno"}
        />

        {/* Apellido Materno */}
        <Componentes.Labels.text
          Value={responsable.apellido_m}
          Onchange={(value) => setResponsable({ ...responsable, apellido_m: value })}
          Placeholder={"Apellido Materno"}
        />

        {/* Correo */}
        <Componentes.Labels.correo
          Value={responsable.correo}
          Onchange={(value) => setResponsable({ ...responsable, correo: value })}
          Placeholder={"Correo"}
        />
<Componentes.Inputs.TitleSubtitle
            titulo="Nota de Edición" 
            contenido="Las notas sirven para justificar el porqué se editó el responsable."
      />
      <Componentes.Labels.area Onchange={(value) =>setMotivo(value)} Value={motivo} Placeholder={"Motivo"}/>
        {/* Botones */}
        <div className="flex flex-row w-[100%] gap-4">
          <Componentes.Botones.Cancelar
            text="Cancelar"
            onClick={() => navigate('/responsable')}  // Redirige a la lista de responsables
          />
          <Componentes.Botones.ConfirmarVerde
            text={"Guardar Cambios"}
          />
        </div>
      </form>
    </>
  );
};

export default ViewResponsableEdit;
