const { Articulos, Condiciones, Imagenes, Asignaciones } = require('../model');
const { Op, where } = require('sequelize');
// Middleware para crear un artículo
exports.createArticle = async (req, res, next) => {
    try {
        const { no_inventario, nombre, descripcion, costo, consumible} = req.body;
        let errores = [];
        // Validar tamaño de las entradas
        if (no_inventario && no_inventario.length > 100) errores.push('El número de inventario no debe exceder 100 caracteres.');
        if (nombre && nombre.length > 100) errores.push('El nombre no debe exceder 100 caracteres.');
        if (descripcion && descripcion.length > 250) errores.push('La descripción no debe exceder 250 caracteres.');
        if (costo !== undefined && (isNaN(costo) || costo < 0)) errores.push('El costo debe ser un número positivo.');
        if (consumible !== null && (!consumible === 0 || !consumible === 1)) errores.push('Consumible solo puede ser 0 o 1');
        // Validar duplicidad del número de inventario
        const fill = await Articulos.findAll({ where: { no_inventario } });
        if (fill.length > 0) errores.push('Ya existe el número de inventario: ' + no_inventario);
        // Validar campos requeridos
        if (!no_inventario) errores.push('Es necesario definir el (no_inventario)');
        if (!nombre) errores.push('Es necesario definir el (nombre)');
        if (!descripcion) errores.push('Es necesario definir el (descripcion)');
        if (costo === undefined) errores.push('Es necesario definir el (costo)');
        if (consumible === undefined) errores.push('Consumible no puede ser null');
        if (errores.length > 0)return res.status(400).json({ error: errores });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección del artículo' });
    }
    next();
};
// Middleware para editar un artículo
exports.editArticle = async (req, res, next) => {
    try {
        const { no_inventario, nombre, descripcion, costo, consumible } = req.body;
        const { id } = req.params;
        let errores = [];
        // Validar campos requeridos
        if (!no_inventario) errores.push('Es necesario definir el (no_inventario)');
        if (!nombre) errores.push('Es necesario definir el (nombre)');
        if (!descripcion) errores.push('Es necesario definir el (descripcion)');
        if (costo === undefined) errores.push('Es necesario definir el (costo)');
        if (consumible === undefined) errores.push('Consumible no puede ser null');
        //proteger elementos nulos 
        if (errores.length > 0) return res.status(400).json({ error: errores });
        // Validar tamaño de las entradas
        if (no_inventario.length > 100) errores.push('El número de inventario no debe exceder 100 caracteres.');
        if (nombre.length > 100) errores.push('El nombre no debe exceder 100 caracteres.');
        if (descripcion.length > 250) errores.push('La descripción no debe exceder 250 caracteres.');
        if (costo !== undefined && (isNaN(costo) || costo < 0)) errores.push('El costo debe ser un número positivo.');
        // Validar existencia del artículo a editar
        const articulo = await Articulos.findByPk(id);
        if (!articulo)errores.push('No se encontró el artículo a editar')
        // Validar que el artículo no está asociado a una asignación
        const asignacion = await Asignaciones.findOne({ where: { Articulos_pk: id } });
        if (asignacion) errores.push('El artículo está asignado a un responsable (debe devolver el artículo para editar)');
        //validar que el numero de inventraio no sea uno existente
        const bandera = await Articulos.findOne({where:{no_inventario:no_inventario}});
        if (bandera !== null && bandera.pk !== articulo.pk) errores.push('Ya existe el número de inventario: ' + no_inventario);
        if (errores.length > 0) return res.status(400).json({ error: errores });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección del artículo'+error });
    }
    next();
};
// Middleware para dar de baja un artículo
exports.bajaArticle = async (req, res, next) => {
    try {
        const { motivo } = req.body;
        const { id } = req.params;
        let errores = [];
        // Validar existencia del artículo
        const articulo = await Articulos.findByPk(id);
        if (!articulo) errores.push('Artículo no encontrado');
        // Validar motivo
        if (!motivo) errores.push('Es necesario definir el (motivo)');
        if (motivo && motivo.length > 250)errores.push('El motivo no debe exceder 250 caracteres.');
        // Validar que el artículo no está asociado a una asignación
        const asignacion = await Asignaciones.findOne({ where: { Articulos_pk: id } });
        if (asignacion)errores.push('El artículo se asignó a un responsable (debe devolver el artículo para su baja)');
        if (errores.length > 0)return res.status(400).json({ error: errores.join(' ') });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección del artículo' });
    }
    next();
};
