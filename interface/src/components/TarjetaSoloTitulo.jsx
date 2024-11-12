import React from 'react';

const TarjetaSoloTitulo = ({ titulo }) => {
  return (
    <div className="grow shrink basis-0 h-[150px] p-4 bg-[#efefef] rounded-xl border border-[#590100] justify-center items-center flex">
      <div className="bg-[#efefef] justify-center items-center flex">
        <div className="text-[#4e2016] text-xl font-normal font-['Roboto']">{titulo}</div>
      </div>
    </div>
  );
};

export default TarjetaSoloTitulo;