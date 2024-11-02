import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const peticiones = {
  darDeBaja: async (id, motivo) => {
    try {
      const response = await fetch(`/responsables/${id}/baja`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo }),
      });
      if (!response.ok) throw new Error('Error al dar de baja el responsable');
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
};

const ViewResponsableRenoval = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await peticiones.darDeBaja(id, motivo);
    if (response) {
      setMensaje('Responsable dado de baja exitosamente');
      setTimeout(() => navigate('/responsables'), 2000); // Redirigir después de 2 segundos
    }
  };

  return (
    <>
      <h1>Baja de Responsable</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo de la baja"
          required
        />
        <button type="submit">Confirmar Baja</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </>
  );
};

export default ViewResponsableRenoval;
