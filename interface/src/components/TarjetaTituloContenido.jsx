import React from 'react';

const TarjetaTituloContenido = ({ titulo, contenido, onChange }) => {
  return (
    <div className="w-full">
      <textarea
        value={contenido}
        onChange={onChange}
        className="w-full h-[100px] p-2 border border-[#ccc] rounded-md focus:outline-none focus:border-[#590100]"
        placeholder="Descripción del Área"
      />
    </div>
  );
};

export default TarjetaTituloContenido;