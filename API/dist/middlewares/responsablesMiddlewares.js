// Middleware para validar los datos de creación de un nuevo responsable
exports.middleCreateResponsable = (req, res, next) => {
    try {
        const { nombre, area_id } = req.body;
        let errores = [];

        if (!nombre) errores.push('Es necesario definir el (nombre) del responsable.');
        if (!area_id) errores.push('Es necesario definir el (area_id) del responsable.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del responsable' });
    }
    next();
};

// Middleware para validar los datos de edición de un responsable existente
exports.middleEditResponsable = (req, res, next) => {
    try {
        const { id, nombre, area_id } = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del responsable.');
        if (!nombre) errores.push('Es necesario definir el (nombre) del responsable.');
        if (!area_id) errores.push('Es necesario definir el (area_id) del responsable.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del responsable' });
    }
    next();
};

// Middleware para validar la baja de un responsable
exports.middleBajaResponsable = (req, res, next) => {
    try {
        const { id, motivo } = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del responsable.');
        if (!motivo) errores.push('Es necesario definir el (motivo) para dar de baja al responsable.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la baja del responsable' });
    }
    next();
};

// Middleware para validar la búsqueda de un responsable
exports.middleSearchResponsable = (req, res, next) => {
    try {
        const { query } = req.params;
        if (!query) {
            return res.status(400).json({ error: 'Es necesario definir un parámetro de búsqueda (query).' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la búsqueda del responsable' });
    }
    next();
};
