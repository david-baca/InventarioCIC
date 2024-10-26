const { Articulos, Condiciones, Imagenes, Asignaciones } = require('../model');
// Middleware para crear un artículo
exports.createArticle = (req, res, next) => {
  try {
      const { no_inventario, nombre, descripcion, costo } = req.body;
      let errores = [];
      if (!no_inventario) errores.push('Es necesario definir el (no_inventario)');
      if (!nombre) errores.push('Es necesario definir el (nombre)');
      if (!descripcion) errores.push('Es necesario definir el (descripcion)');
      if (!costo) errores.push('Es necesario definir el (costo)');
      if (errores.length > 0) {
          return res.status(400).json({ error: errores.join(' ') });
      } 
  } catch (error) {
      return res.status(500).json({ error: 'Error en la protección del artículo' });
  }
  next();
};

// Middleware para editar un artículo
exports.editArticle = async(req, res, next) => {
  try {
      //se debe validar que la estructuira sea coherente
      const {no_inventario, nombre, descripcion, costo} = req.body;
      let errores = [];
      if (!no_inventario) errores.push('Es necesario definir el (no_inventario)');
      if (!nombre) errores.push('Es necesario definir el (nombre)');
      if (!descripcion) errores.push('Es necesario definir el (descripcion)');
      if (!costo) errores.push('Es necesario definir el (costo)');
      //se debe validar que el articulo no esta asocuiad a una asignacion
      const { id } = req.params;
      if((await Asignaciones.findOne({where: { Articulos_pk : id } }))) errores.push('El articulo se asigno a un responsable (debe devolver el articulo para editar)');
      //se debe validar la existencia del articulo
      if((await Asignaciones.findByPk(id)))
      if (errores.length > 0) {
          return res.status(400).json({ error: errores.join(' ') });
      }
  } catch (error) {
      return res.status(500).json({ error: 'Error en la protección del artículo' });
  }
  next();
};

// Middleware para dar de baja un artículo
exports.bajaArticle = async(req, res, next) => {
  try {
      const { motivo } = req.body;
      let errores = [];
      if (!motivo) errores.push('Es necesario definir el (motivo)');
      //se debe validar que el articulo no esta asociado a una asignacion
      const { id } = req.params;
      if((await Asignaciones.findOne({where: { Articulos_pk : id } }))) errores.push('El articulo se asigno a un responsable (debe devolver el articulo para su baja)');
      if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
  } catch (error) {
      return res.status(500).json({ error: 'Error en la protección del artículo' });
  }
  next();
};