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
          <Route path="/articles" element={<Aut children={<Page.Articles.panel />} />} />
          <Route path="/articles/edit/:pk" element={<Aut children={<Page.Articles.edit />} />} />
          <Route path="/articles/detalles/:pk" element={<Aut children={<Page.Articles.information />} />} />
          <Route path="/articles/cargar" element={<Aut children={<Page.Articles.load />} />} />
          <Route path="/articles/removal/:pk" element={<Aut children={<Page.Articles.removal />} />} />
          <Route path="/grups" element={<Aut children={<Page.Groups.panel />} />} />
          <Route path="/grups/edit/:pk" element={<Aut children={<Page.Groups.edit />} />} />
          <Route path="/grups/information/:pk" element={<Aut children={<Page.Groups.information />} />} />
          <Route path="/grups/load" element={<Aut children={<Page.Groups.load />} />} />
          <Route path="/grups/removal/:pk" element={<Aut children={<Page.Groups.removal />} />} />
          <Route path="/almacen" element={<Aut children={<Page.Almacen.panel />} />} />
          <Route path="/almacen/edit/:pk" element={<Aut children={<Page.Almacen.edit />} />} />
          <Route path="/almacen/information/:pk" element={<Aut children={<Page.Almacen.information />} />} />
          <Route path="/almacen/load" element={<Aut children={<Page.Almacen.load />} />} />
          <Route path="/almacen/removal/:pk" element={<Aut children={<Page.Almacen.removal />} />} />
          <Route path="/responsable" element={<Aut children={<Page.Responsable.panel />} />} />
          <Route path="/responsable/edit/:pk" element={<Aut children={<Page.Responsable.edit />} />} />
          <Route path="/responsable/load" element={<Aut children={<Page.Responsable.load />} />} />
          <Route path="/responsable/removal/:pk" element={<Aut children={<Page.Responsable.removal />} />} />
          <Route path="/movimientos" element={<Aut children={<Page.Movimientos.panel />} />} />
          <Route path="/asignaciones/" element={<Aut children={<Page.Movimientos.Asignaciones.seleccionResponsable />} />} />
          <Route path="/asignaciones/:pkResponsable" element={<Aut children={<Page.Movimientos.Asignaciones.seleccionArticulos />} />} />
          <Route path="/asignaciones/:pkResponsable/:pkArticulo" element={<Aut children={<Page.Movimientos.Asignaciones.panel />} />} />
          <Route path="/devoluciones/" element={<Aut children={<Page.Movimientos.Devoluciones.seleccionResponsable />} />} />
          <Route path="/devoluciones/:pkResponsable" element={<Aut children={<Page.Movimientos.Devoluciones.seleccionArticulos />} />} />
          <Route path="/devoluciones/:pkResponsable/:pkArticulo" element={<Aut children={<Page.Movimientos.Devoluciones.panel />} />} />
          <Route path="/reportes-articulo/:pk" element={<Aut children={<Page.Reportes.articulo />} />} />
          <Route path="/reportes-articulos" element={<Aut children={<Page.Reportes.articulos />} />} />
          <Route path="/reportes" element={<Aut children={<Page.Reportes.panel />} />} />
          <Route path="/reportes-responsable/:pk" element={<Aut children={<Page.Reportes.responsable />} />} />
          <Route path="/reportes-responsables" element={<Aut children={<Page.Reportes.responsables />} />} />
          <Route path="/historial" element={<Aut children={<Page.Historial.panel />} />} />
          <Route path="/coordinadores" element={<Aut children={<Page.Users.panel />} />} />
          <Route path="/coordinadores/edit/:pk" element={<Aut children={<Page.Users.edit />} />} />
          <Route path="/coordinadores/load" element={<Aut children={<Page.Users.load />} />} />
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