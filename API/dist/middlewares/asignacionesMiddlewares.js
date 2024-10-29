// Middleware para crear una asignación
exports.middleCreateAsignacion = (req, res, next) => {
    try {
        const { fk_Articulo, fk_Responsable, urlDoc } = req.body;
        let errores = [];
        if (!fk_Articulo) errores.push('Es necesario definir el fk_Articulo.');
        if (!fk_Responsable) errores.push('Es necesario definir el fk_Responsable.');
        if (!urlDoc) errores.push('Es necesario definir el urlDoc.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al validar los datos de la asignación.' });
    }
    next();
};


// Middleware para editar una asignación
exports.middleEditAsignacion = (req, res, next) => {
    try {
        const { id, fk_Articulo, fk_Responsable, fecha_asignacion } = req.body;
        let errores = [];
        if (!id) errores.push('Es necesario definir el ID de la asignación.');
        if (!fk_Articulo) errores.push('Es necesario definir el fk_Articulo.');
        if (!fk_Responsable) errores.push('Es necesario definir el fk_Responsable.');
        if (!fecha_asignacion) errores.push('Es necesario definir la fecha_asignacion.');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al validar los datos de la asignación.' });
    }
    next();
};

// Middleware para dar de baja una asignación
exports.middleBajaAsignacion = (req, res, next) => {
    try {
        const { id, motivo } = req.body;
        let errores = [];
        if (!id) errores.push('Es necesario definir el ID de la asignación.');
        if (!motivo) errores.push('Es necesario definir el motivo de la baja.');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al validar la baja de la asignación.' });
    }
    next();
};

// Middleware para obtener detalles de una asignación
exports.middleGetAsignacionDetails = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Es necesario definir el ID de la asignación.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los detalles de la asignación.' });
    }
    next();
};
