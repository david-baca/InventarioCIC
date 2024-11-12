import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Componentes from '../../components';

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
      <Componentes.Inputs.Title titulo={"hola"} />
      <Componentes.Inputs.TitleSubtitle titulo={"hola"} contenido={"hola2"} />
    </>
  );
};

export default ViewStore;