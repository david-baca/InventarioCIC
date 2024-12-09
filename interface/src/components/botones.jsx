import React from 'react';
import imgExcel from "../../public/img/dowloadExcel.svg"; 
import imgDownload from "../../public/img/download.svg";
import imgTrash from "../../public/img/trash.svg";
import imgPencil from "../../public/img/pencil.svg";
import imgBack from "../../public/img/back.svg";
import imgHop from "../../public/img/hop.svg";
const Continuar = ({ text, onClick, isActive }) => {
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

const ConfirmarVerde = ({ text, onClick }) => {
  return (
    <>
    <button onClick={onClick} className="bg-UP-Exito w-[100%]
    hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg" type='bottom'>
    {text}
    </button>
    </>
  );
}

const ConfirmarRojo = ({ text, onClick }) => {
  return (
    <>
    <button onClick={onClick} className="bg-UP-Error w-[100%]
     text-white font-bold py-2 px-4 rounded-lg">
    Confirmar
    </button>
    </>
  );
}

const Cancelar = ({ text, onClick }) => {
    return (
      <button type="button" onClick={onClick} 
      className="bg-UP-Gris hover:bg-gray-400 text-UP-Negro 
      font-bold py-2 px-4 border border-UP-Negro rounded-lg
      w-[100%]">
        {text}
      </button>
    );
}

const Crear = ({ text, onClick }) => {
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

const Imprimir = ({ text, onClick }) => {
  return (
      <>
      <button onClick={onClick} className="bg-UP-Primario hover:bg-UP-Secundario text-white font-bold py-2 px-4 rounded-lg w-[100%]"
      type="button">
      Imprimir
      </button>
      </>
  );
}

const Regresar = () => {
  return (
    <>
    <button
      className="w-full bg-orange-600 text-white py-2 flex items-center justify-center gap-2 rounded-full hover:bg-orange-700 transition duration-300"
    >
      <img src={imgBack} alt="Regresar" className="h-6 w-6" />
      Regresar
    </button>
    </>
  );
};

const CenterIcon = () => {
  return (
    <>
    <div className="w-full flex justify-center items-center">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-orange-600 flex items-center justify-center rounded-md text-white hover:bg-orange-700 transition duration-300"
      >
        <img src={imgArrowUpRight} alt="Ir" className="h-5 w-5" /> 
      </a>
    </div>
    </>
  );
};

const Download = () => {
  return (
    <>
    <button className="w-full bg-orange-600 text-white py-2 flex items-center justify-center gap-2 rounded-full hover:bg-orange-700 transition duration-300">
      <img src={imgDownload} className="h-6 w-6" /> 
    </button>
    </>
  );
};

const Edit = () => {
  return (
    <button className="bg-orange-600 text-white py-1 px-4 rounded-full text-sm hover:bg-orange-700 transition duration-300">
      Editar
    </button>
  );
};

const ExcelDownload = ({Onclick}) => {
  return (
    <>
    <button className="w-fit p-2 border border-gray-300 
    text-black flex items-center 
    justify-center gap-2 rounded-full 
    hover:bg-gray-100 transition duration-300"
    onClick={Onclick}
    type="button">
      <img src={imgExcel} className='h-6'/> 
      Descargar reporte completo
    </button>
    </>
  );
};

const Hover = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <button className="w-48 h-12 border border-gray-300 text-gray-600 text-center transition duration-300 ease-in-out 
        hover:bg-orange-600 hover:text-white">
        Example content
      </button>
    </div>
  );
};

const Saltar = ({Onclick}) =>{
  return(<button type='buttom' onClick={Onclick}
   className='className="text-white p-2 flex items-center justify-center gap-2 rounded-full border-2 hover:border-UP-Auxiliar transition duration-300 hover:animate-pulse"'>
    <img src={imgHop} className="h-6 w-6" /> 
  </button>)
  }

const ToggleSwitch = () => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center cursor-pointer transition-colors duration-300
        ${isSelected ? 'bg-orange-600' : 'bg-white'} 
        border border-gray-300 
        md:w-12 md:h-12 w-10 h-10 sm:w-14 sm:h-14 
        rounded-md`}
    >
      {isSelected && (
        <span className="text-white text-lg md:text-xl sm:text-2xl font-bold">
          ✓
        </span>
      )}
    </div>
  );
};

const iconPencil = ({Onclik}) =>{
return(<button type='buttom' onClick={Onclik}>
  <img src={imgPencil} className="h-6 w-6" /> 
</button>)
}

const iconTrash = ({Onclik}) =>{
return(<button type='buttom' onClick={Onclik}>
  <img src={imgTrash} className="h-6 w-6" /> 
</button>)
}

const Botones = {
  Continuar,
  ConfirmarVerde,
  ConfirmarRojo,
  Cancelar,
  Crear,
  Imprimir,
  Regresar,
  CenterIcon,
  Download,
  Edit,
  ExcelDownload,
  Hover,
  ToggleSwitch,
  iconPencil,
  iconTrash,
  Saltar
}

export default Botones;