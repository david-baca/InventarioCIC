import React, { useState } from 'react';

const TarjetaTituloContenido = ({ titulo, contenido, onChange }) => {
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = () => setHasFocus(true);
  const handleBlur = () => setHasFocus(false);

  return (
    <div className="relative w-full">
      {/* Etiqueta flotante sobre el marco */}
      <label
        className={`absolute left-2 px-1 bg-white text-sm transition-all duration-300 ${
          hasFocus || contenido ? '-top-3 text-[#590100] scale-90' : 'top-2.5 text-gray-500'
        }`}
      >
        {titulo || 'Descripción del Área'}
      </label>
      <textarea
        value={contenido}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full h-[100px] p-2 border border-[#ccc] rounded-md focus:outline-none focus:border-[#590100] pt-6"
      />
    </div>
  );
};

export default TarjetaTituloContenido;
