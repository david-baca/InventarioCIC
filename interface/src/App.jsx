import "../public/styles/index.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page from './pages';
import Menu from './components/menu'; // Asegúrate de que la importación sea correcta
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { getFromLocalStorage } from './context/Credentials';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
          {/* Ruta de inicio de sesión sin menú */}
          <Route path="/" element={<Page.Login />} />
          {/* Rutas que incluyen el menú */}
          <Route path="/articles" element={<Menu children={<Page.Articles.panel />} />} />
          <Route path="/articles/edit/:pk" element={<Menu children={<Page.Articles.edit />} />} />
          <Route path="/articles/detalles/:pk" element={<Menu children={<Page.Articles.information />} />} />
          <Route path="/articles/cargar" element={<Menu children={<Page.Articles.load />} />} />
          <Route path="/articles/removal/:pk" element={<Menu children={<Page.Articles.removal />} />} />
          <Route path="/grups" element={<Menu children={<Page.Groups.panel />} />} />
          <Route path="/grups/edit/:pk" element={<Menu children={<Page.Groups.edit />} />} />
          <Route path="/grups/information/:pk" element={<Menu children={<Page.Groups.information />} />} />
          <Route path="/grups/load" element={<Menu children={<Page.Groups.load />} />} />
          <Route path="/grups/removal/:pk" element={<Menu children={<Page.Groups.removal />} />} />
          <Route path="/almacen" element={<Menu children={<Page.Almacen.panel />} />} />
          <Route path="/almacen/edit/:pk" element={<Menu children={<Page.Almacen.edit />} />} />
          <Route path="/almacen/information/:pk" element={<Menu children={<Page.Almacen.information />} />} />
          <Route path="/almacen/load" element={<Menu children={<Page.Almacen.load />} />} />
          <Route path="/almacen/removal/:pk" element={<Menu children={<Page.Almacen.removal />} />} />
          <Route path="/responsable" element={<Menu children={<Page.Responsable.panel />} />} />
          <Route path="/responsable/edit/:pk" element={<Menu children={<Page.Responsable.edit />} />} />
          <Route path="/responsable/load" element={<Menu children={<Page.Responsable.load />} />} />
          <Route path="/responsable/removal/:pk" element={<Menu children={<Page.Responsable.removal />} />} />
          <Route path="/movimientos" element={<Menu children={<Page.Movimientos.panel />} />} />
          <Route path="/asignaciones/" element={<Menu children={<Page.Movimientos.Asignaciones.seleccionResponsable />} />} />
          <Route path="/asignaciones/:pkResponsable" element={<Menu children={<Page.Movimientos.Asignaciones.seleccionArticulos />} />} />
          <Route path="/asignaciones/:pkResponsable/:pkArticulo" element={<Menu children={<Page.Movimientos.Asignaciones.panel />} />} />
          <Route path="/devoluciones/" element={<Menu children={<Page.Movimientos.Devoluciones.seleccionResponsable />} />} />
          <Route path="/devoluciones/:pkResponsable" element={<Menu children={<Page.Movimientos.Devoluciones.seleccionArticulos />} />} />
          <Route path="/devoluciones/:pkResponsable/:pkArticulo" element={<Menu children={<Page.Movimientos.Devoluciones.panel />} />} />
          <Route path="/reportes/articulo/:pk" element={<Menu children={<Page.Reportes.articulo />} />} />
          <Route path="/reportes/articulos" element={<Menu children={<Page.Reportes.articulos />} />} />
          <Route path="/reportes" element={<Menu children={<Page.Reportes.panel />} />} />
          <Route path="/reportes/responsable/:pk" element={<Menu children={<Page.Reportes.responsable />} />} />
          <Route path="/reportes/responsables" element={<Menu children={<Page.Reportes.responsables />} />} />
          <Route path="/historial" element={<Menu children={<Page.Historial.panel />} />} />
          <Route path="/coordinadores" element={<Menu children={<Page.Users.panel />} />} />
          <Route path="/coordinadores/edit/:pk" element={<Menu children={<Page.Users.edit />} />} />
          <Route path="/coordinadores/load" element={<Menu children={<Page.Users.load />} />} />
          {/* Ruta no encontrada */}
        <Route path="*" element={<Page.notFund />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}
// Componente Layout que incluye el menú
const Aut = ({ children }) => {
  const local = getFromLocalStorage();
  const navigate = useNavigate();

  useEffect(() => {
    if (local == null ) {
      navigate('/');
    }
  }, [local, navigate]);
  return (
    <Menu>
       {children}
      
    </Menu>
  
       
  );
}
export default App;