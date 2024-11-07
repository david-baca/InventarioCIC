import React from 'react';

const botonContinuar = ({ text, onClick, isActive }) => {
  return (
    <button
      onClick={isActive ? onClick : null} 
      className={`${
        isActive ? 'bg-UP-Primario hover:bg-UP-Secundario' : 'bg-UP-Gris cursor-not-allowed'
      } text-UP-Blanco font-bold py-2 px-4 rounded-full transition duration-300`}
      disabled={!isActive} 
    >
      {text}
    </button>
  );
}

const botonConfirmarVerde = ({ text, onClick }) => {
  return (
    <>
    <button onClick={onClick} className="bg-UP-Exito w-[100%]
    hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
    {text}
    </button>
    </>
  );
}

const botonConfirmarRojo = ({ text, onClick }) => {
  return (
    <>
    <button onClick={onClick} className="bg-UP-Error w-[100%]
     text-white font-bold py-2 px-4 rounded-lg">
    Confirmar
    </button>
    </>
  );
}

const botonCancelar = ({ text, onClick }) => {
    return (
      <button type="button" onClick={onClick} 
      className="bg-UP-Gris hover:bg-gray-400 text-UP-Negro 
      font-bold py-2 px-4 border border-UP-Negro rounded-lg
      w-[100%]">
        {text}
      </button>
    );
}

const botonCrear = ({ text, onClick }) => {
  return (
      <>
      <button onClick={onClick} className="bg-UP-Exito w-[100%]
      hover:bg-green-600 text-white font-bold h-fit p-1 
      rounded-lg">
      + Crear
      </button>
      </>
  );
}

const botonImprimir = ({ text, onClick }) => {
  return (
      <>
      <button onClick={onClick} className="bg-UP-Primario hover:bg-UP-Secundario text-white font-bold py-2 px-4 rounded-lg">
      Imprimir
      </button>
      </>
  );
}

const Botones = {
botonContinuar,
botonConfirmarVerde,
botonCancelar,
botonConfirmarRojo,
botonCrear,
botonImprimir
}

export default Botones;