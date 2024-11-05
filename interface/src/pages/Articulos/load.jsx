import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          'Content-Type': 'multipart/form-data', // Necesario para enviar archivos
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
  const [consumible, setConsumible] = useState(false); // Consumible como booleano
  const [imagenes, setImagenes] = useState([]); // Para manejar las imágenes seleccionadas
  const [error, setError] = useState(null);
  const Peticion = peticion();

  // Handle file selection
  const handleFileChange = (e) => {
    setImagenes(e.target.files); // Guardamos los archivos seleccionados
  };

  const handlePublish = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append('no_inventario', noInventario);
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('costo', parseFloat(costo)); // Convert to float
    formData.append('consumible', consumible ? 1 : 0); // Convert boolean to 1 or 0

    // Agregar las imágenes al FormData
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      const result = await Peticion.Publicar(formData); // Enviar FormData al servidor
      console.log('Published:', result);
      navigate('/articles'); // Redirigir a la lista de artículos después de publicar
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Carga de Artículo</h1>
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
            onChange={() => setConsumible(prev => !prev)} // Alterna el valor de consumible
            className="p-2"
          />
        </div>
        
        {/* Campo para subir imágenes */}
        <div>
          <h2>Imágenes</h2>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="p-2"
          />
          <p>{imagenes.length} archivo(s) seleccionado(s)</p>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2">
          Publicar
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </>
  );
};

export default ViewArticleLoad;
