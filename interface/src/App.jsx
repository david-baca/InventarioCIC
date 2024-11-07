import "../public/styles/index.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page from './pages';
import Menu from './components/menu'; // Asegúrate de que la importación sea correcta
function App() {
  return (
    <Router>
      <Routes>
          {/* Ruta de inicio de sesión sin menú */}
          <Route path="/" element={<Page.Login />} />
          {/* Rutas que incluyen el menú */}
          <Route path="/articles" element={<Menu children={<Page.Articles.panel/>}/>}/>
          <Route path="/articles/edit/:pk" element={<Menu children={<Page.Articles.edit />}/>}/>
          <Route path="/articles/detalles/:no_inventario" element={<Menu children={<Page.Articles.information/>}/>}/>
          <Route path="/articles/cargar" element={<Menu children={<Page.Articles.load/>}/>}/>
          <Route path="/articles/removal/:pk" element={<Menu children={<Page.Articles.removal/>}/>}/> 
          <Route path="/groups" element={<Menu children={<Page.Groups.panel/>}/>}/>

          <Route path="/groups/edit/:pk" element={<Menu children={<Page.Groups.edit/>}/>}/>
          <Route path="/groups/information/:pk" element={<Menu children={<Page.Groups.information/>}/>}/> 
          <Route path="/groups/load" element={<Menu children={<Page.Groups.load/>}/>}/>
          <Route path="/groups/removal/:pk" element={<Menu children={<Page.Groups.removal/>}/>}/> 
          <Route path="/almacen" element={<Menu children={<Page.Almacen.panel />}/>}/>/{/* Rutas que incluyen el menú */}
          <Route path="/almacen/edit/:pk" element={<Page.Almacen.edit />} />
          <Route path="/almacen/information/:pk" element={<Page.Almacen.information />} />
          <Route path="/almacen/load" element={<Page.Almacen.load />} />
          <Route path="/almacen/removal/:pk" element={<Page.Almacen.removal />} />
          <Route path="/responsable" element={<Menu children={<Page.Responsable.panel/>}/>}/> 
          <Route path="/responsable/edit/:pk" element={<Menu children={<Page.Responsable.edit/>}/>}/> 
          <Route path="/responsable/load" element={<Menu children={<Page.Responsable.load/>}/>}/>
          <Route path="/responsable/removal/:pk"  element={<Menu children={<Page.Responsable.removal/>}/>}/>
          <Route path="/movimientos" element={<Page.Movimientos.panel />} />
          <Route path="/asignaciones/" element={<Page.Movimientos.Asignaciones.seleccionResponsable />} />
          <Route path="/asignaciones/:pkResponsable" element={<Page.Movimientos.Asignaciones.seleccionArticulos />} />
          <Route path="/asignaciones/:pkResponsable/:pkArticulo" element={<Page.Movimientos.Asignaciones.panel />} />
          <Route path="/devoluciones/" element={<Page.Movimientos.Devoluciones.seleccionResponsable />} />
          <Route path="/devoluciones/:pkResponsable" element={<Page.Movimientos.Devoluciones.seleccionArticulos />} />
          <Route path="/devoluciones/:pkResponsable/:pkArticulo" element={<Page.Movimientos.Devoluciones.panel />} />
          <Route path="/reportes/articulo/:pk" element={<Page.Reportes.articulo />} />
          <Route path="/reportes/articulos" element={<Page.Reportes.articulos />} />
          <Route path="/reportes" element={<Page.Reportes.panel />} />
          <Route path="/reportes/responsable/:pk" element={<Page.Reportes.responsable />} />
          <Route path="/reportes/responsables" element={<Page.Reportes.responsables />} />
          <Route path="/historial" element={<Page.Historial.panel />} />
          <Route path="/coordinadores" element={<Menu children={<Page.Users.panel/>} />} />
          <Route path="/coordinadores/edit/:pk" element={<Menu children={<Page.Users.edit/>} />} />
          <Route path="/coordinadores/load" element={<Menu children={<Page.Users.load />} />} />
        {/* Ruta no encontrada */}
        <Route path="*" element={<Page.notFund />} />
      </Routes>
    </Router>
  );
}
// Componente Layout que incluye el menú
const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Menu />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
export default App;