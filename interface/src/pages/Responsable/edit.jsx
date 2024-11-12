import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const peticiones = {
  fetchResponsable: async (id, setResponsable, setError) => {
    try {
      const response = await fetch(`/responsables/${id}`);
      if (!response.ok) throw new Error('Error al cargar el responsable');
      const data = await response.json();
      setResponsable(data);
    } catch (err) {
      setError(err.message);
    }
  },
  editarResponsable: async (id, responsable, navigate, setError) => {
    try {
      const response = await fetch(`/responsables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responsable),
      });
      if (!response.ok) throw new Error('Error al editar el responsable');
      navigate('/responsables');
    } catch (err) {
      setError(err.message);
    }
  },
};

const ViewResponsableEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [responsable, setResponsable] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    peticiones.fetchResponsable(id, setResponsable, setError);
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    peticiones.editarResponsable(id, responsable, navigate, setError);
  };

  return (
    <>
      <h1>Editar Responsable</h1>
      <form onSubmit={handleEdit}>
        <input type="text" value={responsable.nombres || ''} onChange={(e) => setResponsable({ ...responsable, nombres: e.target.value })} required />
        <input type="text" value={responsable.apellido_p || ''} onChange={(e) => setResponsable({ ...responsable, apellido_p: e.target.value })} required />
        <input type="text" value={responsable.apellido_m || ''} onChange={(e) => setResponsable({ ...responsable, apellido_m: e.target.value })} required />
        <button type="submit">Guardar</button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </>
  );
};

export default ViewResponsableEdit;
