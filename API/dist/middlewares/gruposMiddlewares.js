const { Articulos } = require("../model");
// Middleware para validar los datos de creación de un nuevo grupo
exports.createGrupo = async (req, res, next) => {
    try {
        const { nombre, descripcion, articulos } = req.body;
        let errores = [];
        if (!nombre) errores.push('Es necesario definir el (nombre) del grupo.');
        else if (nombre.length > 50) errores.push('El (nombre) del grupo no debe exceder los 50 caracteres.');
        if (!descripcion) errores.push('Es necesario definir la (descripcion) del grupo.');
        else if (descripcion.length > 250) errores.push('La (descripcion) del grupo no debe exceder los 250 caracteres.');
        if (articulos && articulos.length > 0) {
            const idsArticulos = articulos.map(articulo => articulo.pk);
            const articulosAsociados = await Articulos.findAll({
                where: {
                    pk: idsArticulos,
                    Grupos_pk: { [Op.ne]: null }
                }
            });
            if (articulosAsociados.length > 0) {
                errores.push('Algunos artículos ya están asociados a otro grupo.');
            }
        }
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del grupo' });
    }
    next();
};
// Middleware para validar los datos de edición de un grupo existente
exports.editGrupo = async (req, res, next) => {
    try {
        const { nombre, descripcion, articulos } = req.body;
        const { id } = req.params;
        let errores = [];
        if (!nombre) errores.push('Es necesario definir el (nombre) del grupo.');
        else if (nombre.length > 50) errores.push('El (nombre) del grupo no debe exceder los 50 caracteres.');
        if (!descripcion) errores.push('Es necesario definir la (descripcion) del grupo.');
        else if (descripcion.length > 250) errores.push('La (descripcion) del grupo no debe exceder los 250 caracteres.');
        if (articulos && articulos.length > 0) {
            const idsArticulos = articulos.map(articulo => articulo.pk);
            const articulosAsociados = await Articulos.findAll({
                where: {
                    pk: idsArticulos,
                    Grupos_pk: { [Op.ne]: null },
                    // Excluir el grupo actual de la búsqueda
                    [Op.and]: [{ pk: { [Op.ne]: id } }]
                }
            });
            if (articulosAsociados.length > 0) {
                errores.push('Algunos artículos ya están asociados a otro grupo.');
            }
        }
        if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del grupo' });
    }
    next();
};
// Middleware para validar la baja de un grupo
exports.bajaGrupo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        let errores = [];
        const asociado = await Articulos.findAll({ where: { Grupos_pk: id } });
        if (asociado.length > 0) errores.push('Asegúrese que ningún artículo esté asociado a este grupo.');
        if (!motivo) errores.push('Es necesario definir el (motivo) para dar de baja el grupo.');
        else if (motivo.length > 250) errores.push('El (motivo) no debe exceder los 250 caracteres.');
        if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la baja del grupo' });
    }
    next();
};