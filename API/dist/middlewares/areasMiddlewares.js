// Middleware para crear un área
exports.middleCreateArea = (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        let errores = [];
        if (!nombre) errores.push('Es necesario definir el (nombre)');
        if (!descripcion) errores.push('Es necesario definir el (descripcion)');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección del área' });
    }
    next();
};

// Middleware para editar un área
exports.middleEditArea = (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const { id } = req.params;
        let errores = [];
        if (!id) errores.push('Es necesario definir el (id) en la ruta');
        if (!nombre) errores.push('Es necesario definir el (nombre)');
        if (!descripcion) errores.push('Es necesario definir el (descripcion)');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección del área' });
    }
    next();
};

// Middleware para dar de baja un área
exports.middleBajaArea = (req, res, next) => {
    try {
        const { id, motivo } = req.body;
        let errores = [];
        if (!id) errores.push('Es necesario definir el (id)');
        if (!motivo) errores.push('Es necesario definir el (motivo)');
    
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la protección del área' });
    }
    next();
};

// Middleware para obtener detalles de un área
exports.middleGetAreaDetails = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Es necesario definir el (id)' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los detalles del área' });
    }
    next();
};

// Middleware para obtener áreas sin artículos asignados
exports.middleGetAreasWithoutArticles = (req, res, next) => {
    try {
        const { fk_Articulo_execpcion } = req.params;
        if (!fk_Articulo_execpcion) {
            return res.status(400).json({ error: 'Es necesario definir el (fk_Articulo_execpcion)' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las áreas sin artículos' });
    }
    next();
};
