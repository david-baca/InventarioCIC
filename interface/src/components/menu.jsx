import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from "../../public/upqroo.svg"
const options = [
  { name: "Inicio", path: "/" },
  { name: "Artículos", path: "/articles" },
  { name: "Grupos", path: "/groups" },
  { name: "Almacén", path: "/almacen" },
  { name: "Responsable", path: "/responsable" },
  { name: "Movimientos", path: "/movimientos" },
  { name: "Reportes", path: "/reportes" },
  { name: "Historial", path: "/historial" },
  { name: "Coordinadores", path: "/coordinadores" },
];

const OptionNav = ({ name, isSelected }) => (
  //${isSelected ? 'bg-gray-300' : 'hover:bg-gray-200'}
  //{name}
  <div className={`w-[100%] p-2 flex flex-row justify-start items-center 
    gap-1 border-[0.5px] border-UP-Opaco border-s-[1rem] rounded-e-md
    ${isSelected ? 'border-s-UP-Primario' :'border-s-UP-Gris'}`}>
  <div className='ps-2 p-1 border border-UP-Opaco rounded-e-md'>
    {isSelected ? <h1>●</h1> : <h1>○</h1>}
  </div>
  <h1>{name}</h1>
</div>

);

const Menu = ({ children }) => {
  const location = useLocation();
  return (
    <>
    <div className='flex flex-row min-h-[100vh] max-h-[100vh] min-w-[100vw] max-w-[100vw] overflow-scroll'>
      <div className="min-h-[100%] max-h-[100%] min-w-[15%] max-w-[15%] overflow-scroll 
      flex-col inline-flex bg-UP-Gris">
        <div className="flex min-w-[100%] max-w-[100%] max-h-[6%] min-h-[6%]
        overflow-hidden">
          <img
            src={logo}
            className="w-[100%]"
          />
        </div>
        <div className="py-5 flex flex-col gap-2.5 w-[100%]">
          <div className="text-UP-Negro">Apartados</div>
          {options.map(({ name, path }) => (
            <Link key={name} to={path}>
              <OptionNav name={name} isSelected={location.pathname === path} />
            </Link>
          ))}
        </div>
      </div>
      <div className='flex flex-col w-[100%]'>
        <div className='bg-UP-Secundario text-UP-Blanco p-5'>
          <h1 className=' font-semibold font-montserrat'>
            Bienvenido Fernando Castillo
          </h1>
        </div>
          <div className='p-5 min-w-[100%] max-w-[100%] min-h-[100%]
          max-h-[100%]'>
            {children}
          </div>
      </div>
    </div>
    </>
  );
};
export default Menu;