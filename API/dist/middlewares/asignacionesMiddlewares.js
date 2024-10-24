// Middleware para crear una asignación
exports.middleCreateAsignacion = (req, res, next) => {
    try {
        const { fk_Area, fk_Articulo, fecha_asignacion } = req.body;
        let errores = [];
        if (!fk_Area) errores.push('Es necesario definir el (fk_Area)');
        if (!fk_Articulo) errores.push('Es necesario definir el (fk_Articulo)');
        if (!fecha_asignacion) errores.push('Es necesario definir la (fecha_asignacion)');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección de la asignación' });
    }
    next();
};

// Middleware para editar una asignación
exports.middleEditAsignacion = (req, res, next) => {
    try {
        const { id, fk_Area, fk_Articulo, fecha_asignacion } = req.body;
        let errores = [];
        if (!id) errores.push('Es necesario definir el (id)');
        if (!fk_Area) errores.push('Es necesario definir el (fk_Area)');
        if (!fk_Articulo) errores.push('Es necesario definir el (fk_Articulo)');
        if (!fecha_asignacion) errores.push('Es necesario definir la (fecha_asignacion)');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección de la asignación' });
    }
    next();
};

// Middleware para dar de baja una asignación
exports.middleBajaAsignacion = (req, res, next) => {
    try {
        const { id, motivo } = req.body;
        let errores = [];
        if (!id) errores.push('Es necesario definir el (id)');
        if (!motivo) errores.push('Es necesario definir el (motivo)');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección de la asignación' });
    }
    next();
};

// Middleware para obtener detalles de una asignación
exports.middleGetAsignacionDetails = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Es necesario definir el (id)' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los detalles de la asignación' });
    }
    next();
};

// Middleware para obtener asignaciones sin áreas o artículos asignados
exports.middleGetAsignacionesWithoutAreaOrArticulo = (req, res, next) => {
    try {
        const { fk_Area_execpcion, fk_Articulo_execpcion } = req.params;
        if (!fk_Area_execpcion && !fk_Articulo_execpcion) {
            return res.status(400).json({ error: 'Es necesario definir al menos un (fk_Area_execpcion) o (fk_Articulo_execpcion)' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las asignaciones sin área o artículo' });
    }
    next();
};
