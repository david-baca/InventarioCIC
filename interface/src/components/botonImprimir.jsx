import React from 'react';

function botonConfirmarVerde({ text, onClick }) {
    return (
        <>
        <button onClick={onClick} className="bg-UP-Primario hover:bg-UP-Secundario text-white font-bold py-2 px-4 rounded-full">
        Imprimir
        </button>
        </>
    );
  }
  
  export default botonConfirmarVerde;