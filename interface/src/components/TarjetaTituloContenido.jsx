import React from 'react';

const TarjetaTituloContenido = ({ titulo, contenido }) => {
  return (
    <div className="flex flex-col">
      <div className="text-UP-Negro text-lg font-bold font-montserrat">{titulo}</div>
      <div className="text-UP-Negro font-normal font-montserrat">{contenido}</div>
    </div>
  );
};

export default TarjetaTituloContenido;