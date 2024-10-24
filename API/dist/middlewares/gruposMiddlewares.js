// Middleware para validar los datos de creación de un nuevo grupo
exports.middleCreateGrupo = (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        let errores = [];

        if (!nombre) errores.push('Es necesario definir el (nombre) del grupo.');
        if (!descripcion) errores.push('Es necesario definir la (descripcion) del grupo.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del grupo' });
    }
    next();
};

// Middleware para validar los datos de edición de un grupo existente
exports.middleEditGrupo = (req, res, next) => {
    try {
        const { id, nombre, descripcion } = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del grupo.');
        if (!nombre) errores.push('Es necesario definir el (nombre) del grupo.');
        if (!descripcion) errores.push('Es necesario definir la (descripcion) del grupo.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del grupo' });
    }
    next();
};

// Middleware para validar la baja de un grupo
exports.middleBajaGrupo = (req, res, next) => {
    try {
        const { id, motivo } = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del grupo.');
        if (!motivo) errores.push('Es necesario definir el (motivo) para dar de baja el grupo.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la baja del grupo' });
    }
    next();
};

// Middleware para validar la búsqueda de un grupo
exports.middleSearchGrupo = (req, res, next) => {
    try {
        const { query } = req.params;
        if (!query) {
            return res.status(400).json({ error: 'Es necesario definir un parámetro de búsqueda (query).' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la búsqueda del grupo' });
    }
    next();
};
