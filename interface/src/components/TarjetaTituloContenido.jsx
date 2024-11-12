import React from 'react';

const TarjetaTituloContenido = ({ titulo, contenido }) => {
  return (
    <div className="grow shrink basis-0 h-[150px] p-4 bg-[#efefef] rounded-xl border border-[#590100] justify-center items-center flex">
      <div className="bg-[#efefef] justify-center items-center flex">
        <div className="text-[#4e2016] text-xl font-normal font-['Roboto']">{titulo}</div>
      </div>
      <div className="justify-center items-center flex">
        <div className="text-[#030303] text-xl font-normal font-['Roboto']">{contenido}</div>
      </div>
    </div>
  );
};

export default TarjetaTituloContenido;