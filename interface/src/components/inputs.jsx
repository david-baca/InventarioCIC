import React, { useEffect, useState } from 'react';

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

  const Paginacion =({data, handleLimit})=>{
    const tolerancia = 5;
    const [page, setPage] = useState();
    const [index, setIndex] = useState({});//index actual de paginacion
    const [pages, setPages] = useState();//calculo de posibles paginas
    const next=()=>{
      const x = {min:index.max+1,max:index.max+tolerancia}
      setPage(page+1)
      setIndex(x)
      handleLimit(x)
    }
    const prev=()=>{
      const x = {min:index.min-tolerancia,max:index.min-1}
      setPage(page-1)
      setIndex(x)
      handleLimit(x)
    }
    useEffect(() => {
      setPage(1)
      setPages(Math.ceil(data.length / tolerancia)) 
      setIndex({min:0,max:tolerancia-1})
      handleLimit({min:0,max:tolerancia-1})
    }, [data]);
    return(
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
      <span className="text-gray-600">
        Mostrando {page} de {pages}
      </span>
      <div className="flex space-x-4 mt-2 sm:mt-0">
        <button
          onClick={()=>prev()}
          className={`text-gray-600 hover:text-gray-800 ${page == 1 && "opacity-50 cursor-not-allowed"}`}
          disabled={page == 1}
          type="button"
        >
          Anterior
        </button>
        <button
          onClick={()=>next()}
          className={`text-gray-600 hover:text-gray-800 ${page == pages && "opacity-50 cursor-not-allowed"}`}
          disabled={page == pages}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </div>
    )
  }

  export default { Title, TitleSubtitle, TitleHeader,Paginacion}