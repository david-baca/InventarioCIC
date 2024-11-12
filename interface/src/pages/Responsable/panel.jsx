import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const peticiones = {
  fetchResponsables: async (setResponsables) => {
    try {
      const response = await fetch('/responsables');
      if (!response.ok) throw new Error('Error al cargar responsables');
      const data = await response.json();
      setResponsables(data);
    } catch (error) {
      Error(error);
    }
  },
  buscarResponsables: async (query, setResponsables) => {
    try {
      const response = await fetch(`/responsables/search/${query}`);
      if (!response.ok) throw new Error('Error al buscar responsables');
      const data = await response.json();
      setResponsables(data);
    } catch (error) {
      console.error(error);
    }
  },
};

const ViewResponsable = () => {
  const navigate = useNavigate();
  const [responsables, setResponsables] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    peticiones.fetchResponsables(setResponsables);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    peticiones.buscarResponsables(query, setResponsables);
  };

  const handleEdit = (id) => {
    navigate(`/responsables/edit/${id}`);
  };

  const handleBaja = (id) => {
    navigate(`/responsables/baja/${id}`);
  };

  return (
    <>
      <h1>Panel de Responsables</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar responsables"
        />
        <button type="submit">Buscar</button>
      </form>
      <button onClick={() => navigate('/responsables/cargar')}>Crear Responsable</button>
      <div>
        {responsables.map((resp) => (
          <div key={resp.id}>
            <h2>{resp.nombres} {resp.apellido_p} {resp.apellido_m}</h2>
            <button onClick={() => handleEdit(resp.id)}>Editar</button>
            <button onClick={() => handleBaja(resp.id)}>Dar de baja</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewResponsable;
