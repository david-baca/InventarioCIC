import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from "../../public/img/upqroo.png";
import menu from "../../public/img/menu.svg";
import { clearFromLocalStorage, getFromLocalStorage } from '../context/Credentials';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Componentes from './';


const options = [
  {
    name: "Artículos",
    routes: [
      { path: "/articles", codePermiso: 1 },
      { path: "/articles/edit/:pk", codePermiso: 2 },
      { path: "/articles/detalles/:no_inventario", codePermiso: 2 },
      { path: "/articles/cargar", codePermiso: 2 },
      { path: "/articles/removal/:pk", codePermiso: 3 }
    ]
  },
  {
    name: "Grupos",
    routes: [
      { path: "/groups", codePermiso: 4 },
      { path: "/groups/edit/:pk", codePermiso: 5 },
      { path: "/groups/information/:pk", codePermiso: 5 },
      { path: "/groups/load", codePermiso: 5 },
      { path: "/groups/removal/:pk", codePermiso: 6 }
    ]
  },
  {
    name: "Almacén",
    routes: [
      { path: "/almacen", codePermiso: 7 },
      { path: "/almacen/edit/:pk", codePermiso: 8 },
      { path: "/almacen/information/:pk", codePermiso: 8 },
      { path: "/almacen/load", codePermiso: 8 },
      { path: "/almacen/removal/:pk", codePermiso: 9 }
    ]
  },
  {
    name: "Responsables",
    routes: [
      { path: "/responsable", codePermiso: 10 },
      { path: "/responsable/edit/:pk", codePermiso: 11 },
      { path: "/responsable/load", codePermiso: 11 },
      { path: "/responsable/removal/:pk", codePermiso: 12 }
    ]
  },
  {
    name: "Movimientos",
    routes: [
      { path: "/movimientos", codePermiso: 13 }
    ]
  },
  {
    name: "Coordinadores",
    routes: [
      { path: "/coordinadores", codePermiso: 14 },
      { path: "/coordinadores/edit/:pk", codePermiso: 15 },
      { path: "/coordinadores/load", codePermiso: 15 }
    ]
  }
]

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
  const [vistaGuardian, setVistaGuardian] = useState()
  const location = useLocation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Cambia el tamaño según tus necesidades

  const [error, setError] = useState();
  const [showInfo, setShowInfo] = useState(); 
  const [success, setSuccess] = useState(); 
  
  const handleActionInfo = () => {
    setShowInfo(null); 
  };
  const handleActionEror = () => {
    setError(null); 
  };
  const handleActionSuccess= () => {
    setSuccess(null); 
    navigate('/articles');
  };

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
    const localCredetial = getFromLocalStorage();
    let bandera = false;
  
    if(localCredetial !== null){
    // Recorre las opciones y verifica si el usuario tiene permisos para alguna ruta
    options.forEach(({ routes }) => {
      for(let i = 0; i<routes.length; i++){
        //console.log(routes[i].codePermiso[0])
        //console.log(localCredetial)
        for(let i2 = 0; i2<localCredetial.permisos.length; i2++){
          if(localCredetial.permisos[i2].Funciones_pk == routes[i].codePermiso && routes[i].path == location.pathname){
            bandera=true}
        }
      }
    });
    }
  
    // Si no se encuentra ningún permiso válido, muestra el error
    
    setVistaGuardian(bandera)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location]);

  return (
    <>
    
      <Componentes.Modals.success mensaje={success} action={handleActionSuccess}/>
      <Componentes.Modals.info mensaje={showInfo} action={handleActionInfo}/>
      <Componentes.Modals.error mensaje={error} action={handleActionEror}/>
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
              {options.map(({ name, routes }) => {
  return (
    <Link key={name} to={routes[0].path}>
      <OptionNav name={name} isSelected={routes.some(route => location.pathname.includes(route.path))} />
    </Link>
  );
})}
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
          {vistaGuardian}
          {vistaGuardian == true ? (
          children
           ) : (
           
           
           //<h1>No tienes permiso de estar aquí ☺</h1>
           children
           )}
            
          </div>
        </div>
      </div>
    </>
  );
};
export default Menu;