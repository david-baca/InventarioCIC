import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page from './pages';
function App() {
  return (
    <> 
      <Router>
        <Routes>
          <Route path="/" element={<Page.Login/>} />  
          <Route path="/" element={<Page.Login/>} />
          {/* Rutas para Artículos */}
        <Route path="/articles" element={<Page.Articles.panel />} />
        <Route path="/articles/edit/:pk" element={<Page.Articles.edit />} />
        <Route path="/articles/detalles/:no_inventario" element={<Page.Articles.information />} />
        <Route path="/articles/cargar" element={<Page.Articles.load />} />
        <Route path="/articles/removal/:pk" element={<Page.Articles.removal />} />
        {/* Rutas para Grupos */}
        <Route path="/groups" element={<Page.Groups.panel />} />
        <Route path="/groups/edit/:pk" element={<Page.Groups.edit />} />
        <Route path="/groups/information/:pk" element={<Page.Groups.information />} />
        <Route path="/groups/load" element={<Page.Groups.load />} />
        <Route path="/groups/removal/:pk" element={<Page.Groups.removal />} />
        {/* Rutas para Almacén */}
        <Route path="/almacen" element={<Page.Almacen.panel />} />
        <Route path="/almacen/edit/:pk" element={<Page.Almacen.edit />} />
        <Route path="/almacen/information/:pk" element={<Page.Almacen.information />} />
        <Route path="/almacen/load" element={<Page.Almacen.load />} />
        <Route path="/almacen/removal/:pk" element={<Page.Almacen.removal />} />
        {/* Rutas para Responsable */}
        <Route path="/responsable" element={<Page.Responsable.panel />} />
        <Route path="/responsable/edit/:pk" element={<Page.Responsable.edit />} />
        <Route path="/responsable/load" element={<Page.Responsable.load />} />
        <Route path="/responsable/removal/:pk" element={<Page.Responsable.removal />} />
        {/* Rutas para Movimientos */}
        <Route path="/movimientos" element={<Page.Movimientos.panel />} />
        <Route path="/asignaciones/" element={<Page.Movimientos.Asignaciones.seleccionResponsable />} />
        <Route path="/asignaciones/:pkResponsable" element={<Page.Movimientos.Asignaciones.seleccionArticulos />} />
        <Route path="/asignaciones/:pkResponsable/:pkArticulo" element={<Page.Movimientos.Asignaciones.panel />} />
        <Route path="/devoluciones/" element={<Page.Movimientos.Devoluciones.seleccionResponsable />} />
        <Route path="/devoluciones/:pkResponsable" element={<Page.Movimientos.Devoluciones.seleccionArticulos />} />
        <Route path="/devoluciones/:pkResponsable/:pkArticulo" element={<Page.Movimientos.Devoluciones.panel />} />      {/* Rutas para Reportes */}
        {/* Rutas para Reportes */}
        <Route path="/reportes/articulo/:pk" element={<Page.Reportes.articulo />} />
        <Route path="/reportes/articulos" element={<Page.Reportes.articulos />} />
        <Route path="/reportes" element={<Page.Reportes.panel />} />
        <Route path="/reportes/responsable/:pk" element={<Page.Reportes.responsable />} />
        <Route path="/reportes/responsables" element={<Page.Reportes.responsables />} />
        {/* Rutas para Historial */}
        <Route path="/historial" element={<Page.Historial.panel />} />
        {/* Rutas para Usuarios */}
        <Route path="/coordinadores" element={<Page.Users.panel />} />
        <Route path="/coordinadores/edit/:pk" element={<Page.Users.edit />} />
        <Route path="/coordinadores/load" element={<Page.Users.load />} />
        {/* Ruta no encontrada */}
        <Route path="*" element={<Page.notFund/>} />

        </Routes>
      </Router>
    </>
  )
}

export default App
