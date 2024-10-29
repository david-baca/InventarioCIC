import Cpanel from '../pages/Coordinadores/panel';
import Cload from '../pages/Coordinadores/load';
import Cedit from '../pages/Coordinadores/edit';

import Login from '../pages/login';

import Apanel from '../pages/Articulos/panel';
import Aedit from '../pages/Articulos/edit';
import Ainformation from '../pages/Articulos/information';
import Aload from '../pages/Articulos/load';
import Aremoval from '../pages/Articulos/removal';

import Gpanel from '../pages/Grupos/panel';
import Gedit from '../pages/Grupos/edit';
import Ginformation from '../pages/Grupos/information';
import Gload from '../pages/Grupos/load';
import Gremoval from '../pages/Grupos/removal';

import AlmacenPanel from '../pages/Almacen/panel';
import AlmacenEdit from '../pages/Almacen/edit';
import AlmacenInformation from '../pages/Almacen/information';
import AlmacenLoad from '../pages/Almacen/load';
import AlmacenRemoval from '../pages/Almacen/removal';

import Rpanel from '../pages/Responsable/panel';
import Redit from '../pages/Responsable/edit';
import Rload from '../pages/Responsable/load';
import Rremoval from '../pages/Responsable/removal';

import Mpanel from '../pages/Movimientos/panel';

import MasiRespon from '../pages/Movimientos/asignaciones/responsibleSelect';
import MasiArticle from '../pages/Movimientos/asignaciones/articleSelect';
import Masignaciones from '../pages/Movimientos/asignaciones/assign';

import MdevRespon from '../pages/Movimientos/devoluciones/responsibleSelect';
import MdevArticle from '../pages/Movimientos/devoluciones/articleSelect';
import Mdevoluciones from '../pages/Movimientos/devoluciones/restock';

import Rarticulo from '../pages/Reportes/articulo';
import Rarticulos from '../pages/Reportes/articulos';
import RpanelReportes from '../pages/Reportes/panel';
import Rresponsable from '../pages/Reportes/responsable';
import Rresponsables from '../pages/Reportes/responsables';

import Hpanel from '../pages/Historial/panel';

import notFund from '../pages/notFund';

const routes = {
  Articles: {
    panel: Apanel,
    edit: Aedit,
    information: Ainformation,
    load: Aload,
    removal: Aremoval,
  },
  Groups: {
    panel: Gpanel,
    edit: Gedit,
    information: Ginformation,
    load: Gload,
    removal: Gremoval,
  },
  Almacen: {
    panel: AlmacenPanel,
    edit: AlmacenEdit,
    information: AlmacenInformation,
    load: AlmacenLoad,
    removal: AlmacenRemoval
  },
  Responsable: {
    panel: Rpanel,
    edit: Redit,
    load: Rload,
    removal: Rremoval,
  },
  Movimientos: {
    panel: Mpanel,
    Asignaciones: {
        seleccionResponsable:MasiRespon,
        seleccionArticulos:MasiArticle,
        panel:Masignaciones,
    },
    Devoluciones: {
        seleccionResponsable:MdevRespon,
        seleccionArticulos:MdevArticle,
        panel:Mdevoluciones,
    },
  },
  Reportes: {
    articulo: Rarticulo,
    articulos: Rarticulos,
    panel: RpanelReportes,
    responsable: Rresponsable,
    responsables: Rresponsables,
  },
  Historial: {
    panel: Hpanel,
  },
  Users:{
    panel: Cpanel,
    edit: Cedit,
    load: Cload
  },
  Login,
  notFund
};

export default routes;