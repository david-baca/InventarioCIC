const { Asignaciones, Responsables } = require("../model");

// Middleware para validar los datos de creación de un nuevo responsable
exports.crearResponsable = (req, res, next) => {
    try {
        const { nombres, apellido_p, apellido_m, correo } = req.body;
        let errores = [];

        // Validar campos requeridos y tamaños
        if (!correo || correo.length > 100) 
            errores.push('Es necesario definir el (correo) del responsable y no puede exceder 100 caracteres.');

        if (!nombres || nombres.length > 100) 
            errores.push('Es necesario definir el (nombres) del responsable y no puede exceder 100 caracteres.');
        
        if (!apellido_p || apellido_p.length > 50) 
            errores.push('Es necesario definir el (apellido_p) del responsable y no puede exceder 50 caracteres.');
        
        if (!apellido_m || apellido_m.length > 50) 
            errores.push('Es necesario definir el (apellido_m) del responsable y no puede exceder 50 caracteres.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del responsable' });
    }
    next();
};

// Middleware para validar los datos de edición de un responsable existente
exports.editarResponsable = async (req, res, next) => {
    try {
        const {nombres, apellido_p, apellido_m, correo } = req.body;
        const { id } = req.params;
        let errores = [];
        // Validar campos requeridos
        if (!id) errores.push('Es necesario definir el (id) del responsable.');
        if (!nombres) errores.push('Es necesario definir los (nombres)');
        if (!apellido_p) errores.push('Es necesario definir el (apellido materno)');
        if (!apellido_m) errores.push('Es necesario definir el (apellido paterno)');
        if (!correo) errores.push('Es necesario definir el (correo)');
        if (errores.length > 0) return res.status(400).json({ error: errores });
        // Validar tamaños
        if (nombres.length > 100) errores.push('El (nombres) del responsable no puede exceder 100 caracteres.');
        if (apellido_p.length > 50) errores.push('El (apellido_p) del responsable no puede exceder 50 caracteres.');
        if (apellido_m.length > 50) errores.push('El (apellido_m) del responsable no puede exceder 50 caracteres.');
        if (errores.length > 0) return res.status(400).json({ error: errores });
        // Validar existencia del responsable
        const responsable = await Responsables.findByPk(id);
        if (!responsable) errores.push('Responsable no encontrado.');
        if (errores.length > 0) return res.status(400).json({ error: errores });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del responsable'+error });
    }
    next();
};

// Middleware para validar la baja de un responsable
exports.darDeBajaResponsable = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        let errores = [];

        // Validar que el responsable esté asociado a asignaciones
        const asignaciones = await Asignaciones.findAll({ where: { Responsables_pk: id } });
        if (asignaciones.length > 0) 
            errores.push('Algunos artículos están asociados a este responsable.');

        if (!motivo || motivo.length > 250) 
            errores.push('Es necesario definir el (motivo) para dar de baja al responsable y no puede exceder 250 caracteres.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join('holap') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la baja del responsable' });
    }
    next();
};
