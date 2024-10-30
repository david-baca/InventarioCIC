import React from 'react';

function botonConfirmarVerde({ text, onClick }) {
    return (
        <>
        <button onClick={onClick} className="bg-UP-Exito hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
        Confirmar
        </button>
        </>
    );
  }
  
  export default botonConfirmarVerde;