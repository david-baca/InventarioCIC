import React from 'react';

function botonCrear({ text, onClick }) {
    return (
        <>
        <button onClick={onClick} className="bg-UP-Exito hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
        + Crear
        </button>
        </>
    );
  }
  
  export default botonCrear;