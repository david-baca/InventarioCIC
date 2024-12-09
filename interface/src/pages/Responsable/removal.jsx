import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import peticion from '../../services/responsablesService';
import Componentes from '../../components';

const ViewResponsableRenoval = () => {
  // Configuración de peticiones
  const Peticion = useMemo(() => peticion(), []);
  const navigate = useNavigate();
  const { pk } = useParams();  // Obtenemos el id del responsable desde los parámetros
  const [responsable, setResponsable] = useState(null);
  
  // Variables del formulario
  const [motivo, setMotivo] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Funciones para los modales
  const handleActionSuccess = () => {
    setSuccess(null);
    navigate('/responsable');  // Redirigir a la lista de responsables
  };

  const handleActionError = () => {
    setError(null);
  };

  // Cargar los detalles del responsable
  useEffect(() => {
    const cargarResponsable = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setResponsable(result.responsable);
        if (result.responsable && result.responsable.articulosAsignados > 0) {
          setError('Este responsable tiene artículos asignados. No se puede eliminar.');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    cargarResponsable();
  }, [pk, Peticion]);

  // Manejo del formulario de baja
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Peticion.EliminarResponsable(pk, motivo);
      setSuccess('Responsable dado de baja exitosamente');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Modales de éxito y error */}
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess} />
      <Componentes.Modals.error mensaje={error} action={handleActionError} />

      {/* Título de la página */}
      <Componentes.Inputs.TitleHeader text="Baja de Responsable" />

      {responsable === null ? (
        <div>Cargando detalles del responsable...</div>
      ) : (
        <div className="gap-10 flex flex-col">
          <form onSubmit={handleSubmit} className='space-y-6'>
            <Componentes.Inputs.TitleSubtitle 
              titulo="Los motivos de eliminación son campos para comentar el porqué se elimina un registro." 
              contenido="Motivo de la baja" 
            />
            <Componentes.Labels.area 
              Onchange={(value) => setMotivo(value)} 
              Value={motivo} 
              Placeholder="Motivo de la baja" 
            />
            <div className="flex flex-row w-[100%] gap-4">
              <Componentes.Botones.Cancelar text="Cancelar" onClick={() => navigate('/responsable')} />
              <Componentes.Botones.ConfirmarRojo text="Confirmar Baja" />
            </div>
          </form>

          {/* Información adicional sobre la baja */}
          <Componentes.Inputs.TitleSubtitle 
            titulo={`Eliminación del responsable ${responsable.nombre}`} 
            contenido={`Yo, [user name], en mi calidad de Administrador, declaro que en fecha ${new Date().toLocaleDateString()} se procede a dar de baja el responsable ${responsable.nombre}. Esta decisión se toma debido a [${motivo}].`} 
          />
        </div>
      )}
    </>
  );
};

export default ViewResponsableRenoval;
