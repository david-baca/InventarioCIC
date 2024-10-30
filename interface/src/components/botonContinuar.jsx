import React from 'react';

function BotonContinuar({ text, onClick, isActive }) {
  return (
    <button
      onClick={isActive ? onClick : null} 
      className={`${
        isActive ? 'bg-UP-Primario hover:bg-UP-Secundario' : 'bg-UP-Gris cursor-not-allowed'
      } text-UP-Blanco font-bold py-2 px-4 rounded-full transition duration-300`}
      disabled={!isActive} 
    >
      Continuar
    </button>
  );
}

export default BotonContinuar;