import React from 'react';

const TarjetaSoloTitulo = ({ titulo, onChange }) => {
  return (
    <div className="w-full">
      <input
        type="text"
        value={titulo}
        onChange={onChange}
        className="w-full h-[40px] p-2 border border-[#ccc] rounded-md focus:outline-none focus:border-[#590100]"
        placeholder="Nombre del Área"
      />
    </div>
  );
};



export default TarjetaSoloTitulo;