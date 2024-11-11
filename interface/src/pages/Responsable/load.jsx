import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const peticiones = {
  crearResponsable: async (responsable, navigate, setError) => {
    try {
      const response = await fetch('/responsables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responsable),
      });
      if (!response.ok) throw new Error('Error al crear el responsable');
      navigate('/responsables');
    } catch (err) {
      setError(err.message);
    }
  },
};

const ViewResponsableLoad = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellido_p, setApellidoP] = useState('');
  const [apellido_m, setApellidoM] = useState('');
  const [error, setError] = useState(null);

  const handlePublish = (e) => {
    e.preventDefault();
    peticiones.crearResponsable({ nombres, apellido_p, apellido_m }, navigate, setError);
  };

  return (
    <>
      <h1>Cargar Responsable</h1>
      <form onSubmit={handlePublish}>
        <input type="text" placeholder="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
        <input type="text" placeholder="Apellido Paterno" value={apellido_p} onChange={(e) => setApellidoP(e.target.value)} required />
        <input type="text" placeholder="Apellido Materno" value={apellido_m} onChange={(e) => setApellidoM(e.target.value)} required />
        <button type="submit">Publicar</button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </>
  );
};

export default ViewResponsableLoad;
