import React from 'react';

const Title = ({ titulo }) => {
  return (
    <div className="grow shrink basis-0 h-[150px] p-4 bg-[#efefef] rounded-xl border border-[#590100] justify-center items-center flex">
      <div className="bg-[#efefef] justify-center items-center flex">
        <div className="text-[#4e2016] text-xl font-normal font-['Roboto']">{titulo}</div>
      </div>
    </div>
  );
};

const TitleSubtitle = ({ titulo, contenido }) => {
    return (
      <div className="flex flex-col">
        <div className="text-UP-Negro text-lg font-bold font-montserrat">{titulo}</div>
        <div className="text-UP-Negro font-normal font-montserrat">{contenido}</div>
      </div>
    );
  };

  const TitleHeader = ({text}) => {
    return (
      <div className="w-full bg-UP-Secundario py-2 flex">
        <h1 className="font-montserrat font-bold text-white px-5 text-xl sm:text-xl md:text-lg lg:text-2xl">
          {text}
        </h1>
      </div>
    );
  };

  export default { Title, TitleSubtitle, TitleHeader}