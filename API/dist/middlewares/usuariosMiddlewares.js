// Middleware para validar los datos de creación de un nuevo usuario
exports.middleCreateUsuario = (req, res, next) => {
    try {
        const { nombre, email, password, rol_id } = req.body;
        let errores = [];

        if (!nombre) errores.push('Es necesario definir el (nombre) del usuario.');
        if (!email) errores.push('Es necesario definir el (email) del usuario.');
        if (!password) errores.push('Es necesario definir el (password) del usuario.');
        if (!rol_id) errores.push('Es necesario definir el (rol_id) del usuario.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del usuario' });
    }
    next();
};

// Middleware para validar los datos de edición de un usuario existente
exports.middleEditUsuario = (req, res, next) => {
    try {
        const { id, nombre, email, password, rol_id } = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del usuario.');
        if (!nombre) errores.push('Es necesario definir el (nombre) del usuario.');
        if (!email) errores.push('Es necesario definir el (email) del usuario.');
        if (!rol_id) errores.push('Es necesario definir el (rol_id) del usuario.');
        if (password && password.length < 6) errores.push('El (password) debe tener al menos 6 caracteres.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del usuario' });
    }
    next();
};

// Middleware para validar la baja de un usuario
exports.middleBajaUsuario = (req, res, next) => {
    try {
        const { id, motivo } = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del usuario.');
        if (!motivo) errores.push('Es necesario definir el (motivo) para dar de baja al usuario.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la baja del usuario' });
    }
    next();
};

// Middleware para validar la búsqueda de un usuario
exports.middleSearchUsuario = (req, res, next) => {
    try {
        const { query } = req.params;
        if (!query) {
            return res.status(400).json({ error: 'Es necesario definir un parámetro de búsqueda (query).' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la búsqueda del usuario' });
    }
    next();
};