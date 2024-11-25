import React, { useState } from 'react';

const TarjetaSoloTitulo = ({ titulo, onChange }) => {
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = () => setHasFocus(true);
  const handleBlur = () => setHasFocus(false);

  return (
    <div className="relative w-full">
      {/* Etiqueta flotante sobre el marco */}
      <label
        className={`absolute left-2 px-1 bg-white text-sm transition-all duration-300 ${
          hasFocus || titulo ? '-top-3 text-[#590100] scale-90' : 'top-2.5 text-gray-500'
        }`}
      >
        Nombre del Área
      </label>
      <input
        type="text"
        value={titulo}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full h-[40px] p-2 border border-[#ccc] rounded-md focus:outline-none focus:border-[#590100]"
      />
    </div>
  );
};

export default TarjetaSoloTitulo;
