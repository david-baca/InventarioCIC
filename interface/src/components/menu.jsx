import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from "../../public/img/upqroo.png";
import menu from "../../public/img/menu.svg";
import { clearFromLocalStorage } from '../context/Credentials';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  <div className={`w-[100%] p-2 flex flex-row justify-start items-center 
    gap-1 border-[0.5px] border-UP-Opaco border-s-[1.5rem] rounded-e-md
    ${isSelected ? 'border-s-UP-Primario' : 'border-s-UP-Blanco'}`}>
    <div className='ps-2 p-1 border border-UP-Opaco rounded-e-md justify-center items-center'>
      {isSelected ? <h1 className=' inline-block'>●</h1> : <h1 className=' inline-block'>○</h1>}
    </div>
    <h1>{name}</h1>
  </div>
);

const Menu = ({ children }) => {
  const location = useLocation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Cambia el tamaño según tus necesidades

  const navigate = useNavigate();
  const auth = useAuth();
  const exit = () => {
    clearFromLocalStorage();
    auth?.logout();
    navigate(0);
  };

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className='flex flex-row min-h-[100vh] max-h-[100vh] min-w-[100vw] max-w-[100vw] overflow-hidden'>
        {/* Menú lateral */}
        {(isMenuVisible || !isMobile) && (
          <div className="min-w-[40%] max-w-[40%] overflow-scroll
          lg:min-w-[18%] lg:max-w-[18%] md:min-w-[25%] md:max-w-[25%] sm:min-w-[32%] sm:max-w-[32%] 
          flex-col inline-flex bg-UP-Blanco p-3">
            <div className="flex min-w-[100%] max-w-[100%] max-h-[10%] min-h-[10%]
            overflow-hidden">
              <img src={logo} className="w-[100%] h-[100%]" alt="Logo" />
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
        )}
        
        {/* Contenido */}
        <div className='flex flex-col w-[100%] max-h-[100%] min-h-[100%] overflow-hidden'>
          <div className='bg-UP-Secundario text-UP-Blanco p-5 h-[10%] flex justify-between items-center'>
            {isMobile && (
              <button onClick={toggleMenu} className="p-2 bg-UP-Secundario text-UP-Blanco">
                <img src={menu} className="w-[1rem] h-[1rem]" alt="Logo" />
              </button>
            )}
            <h1 className='font-semibold font-montserrat text-xl sm:text-base md:text-lg lg:text-xl'>Bienvenido Fernando Castillo</h1>
            <button className='bottom-3 font-roboto font-medium' onClick={exit} >Cerrar sesión</button>
          </div>
          <div className='p-5 min-w-[100%] max-w-[100%] h-[90%] overflow-scroll flex flex-col gap-4'>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
export default Menu;