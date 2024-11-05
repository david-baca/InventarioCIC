import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Upimagen from '../../components/upimagen';
import TarjetaSoloTitulo from '../../components/TarjetaSoloTitulo';
import TarjetaTituloContenido from '../../components/TarjetaTituloContenido';

const ViewStore = () => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  return (
    <>
      <h1>Vista almacen 1</h1>
      
      
      <div>
        <input
          type="text"
          placeholder="Ingrese el título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Ingrese el contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="p-2 border rounded ml-2"
        />
      </div>

      <TarjetaSoloTitulo titulo={titulo} />
      <TarjetaTituloContenido  contenido={contenido} />
      
      
      <Upimagen />
    </>
  );
};

export default ViewStore;