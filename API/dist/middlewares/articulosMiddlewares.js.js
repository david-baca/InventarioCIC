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
exports.editArticle = (req, res, next) => {
  try {
      const { id, no_inventario, nombre, descripcion, costo } = req.body;
      let errores = [];
      if (!id) errores.push('Es necesario definir el (id)');
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

// Middleware para dar de baja un artículo
exports.bajaArticle = (req, res, next) => {
  try {
      const { motivo } = req.body;
      let errores = [];
      if (!motivo) errores.push('Es necesario definir el (motivo)');
      if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
  } catch (error) {
      return res.status(500).json({ error: 'Error en la protección del artículo' });
  }
  next();
};

// Middleware para obtener detalles de un artículo
exports.detallesArticulo = (req, res, next) => {
  try {
      const { no_inventario } = req.params;
      if (!no_inventario) {
          return res.status(400).json({ error: 'Es necesario definir el (no_inventario)' });
      }
  } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los detalles del artículo' });
  }
  next();
};

// Middleware para obtener artículos sin grupo
exports.articulosSinGrupo = (req, res, next) => {
  try {
      const { fk_Grupo_execpcion } = req.params;
      if (!fk_Grupo_execpcion) {
          return res.status(400).json({ error: 'Es necesario definir el (fk_Grupo_execpcion)' });
      }
  } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los artículos sin grupo' });
  }
  next();
};

// Middleware para obtener artículos sin área
exports.articulosSinArea = (req, res, next) => {
  try {
      const { fk_Area_execpcion } = req.params;
      if (!fk_Area_execpcion) {
          return res.status(400).json({ error: 'Es necesario definir el (fk_Area_execpcion)' });
      }
  } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los artículos sin área' });
  }
  next();
};
