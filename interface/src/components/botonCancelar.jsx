import React from 'react';

function BotonCancelar({ text, onClick }) {
  return (
    <button
      onClick={onClick} className="bg-UP-Gris hover:bg-gray-400 text-UP-Negro font-bold py-2 px-4 border border-UP-Negro rounded-full">
      Cancelar
    </button>
  );
}

export default BotonCancelar;