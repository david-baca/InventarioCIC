// Middleware para validar los datos de creación de un nuevo usuario
exports.createUsuario = (req, res, next) => {
    try {
        const { nombre, apellido_p, apellido_m, correo} = req.body;
        const nombreValido = /^[A-Za-z\s]+$/;
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let errores = []

        if (!nombre) errores.push('Es necesario definir el (nombre) del usuario.');
        if (!apellido_p) errores.push('Es necesario definir el (apellido paterno) del usuario.');
        if (!apellido_m) errores.push('Es necesario definir el (apellido materno) del usuario.');
        if (!correo) errores.push('Es necesario definir el (email) del usuario.');
        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }

        if (nombre.length > 100) {errores.push("El nombre no puede exceder los 100 caracteres.");}
        if (apellido_p.length > 50) {errores.push("El apellido paterno no puede exceder los 50 caracteres.");}
        if (apellido_m.length > 50) {errores.push("El apellido materno no puede exceder los 50 caracteres.");}

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }

        if (!nombre || !nombreValido.test(nombre)){errores.push("El nombre solo puede contener letras y espacios.");}
        if (!apellido_p || !nombreValido.test(apellido_p)){errores.push("El apellido paterno solo puede contener letras y espacios.");}
        if (!apellido_m || !nombreValido.test(apellido_m)){errores.push("El apellido materno solo puede contener letras y espacios.");}
        if (!correo || !emailValido.test(correo)) {errores.push("El formato de correo electrónico no es válido.");}

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del usuario' + error});
    }
    next();
};

// Middleware para validar los datos de edición de un usuario existente
exports.editUsuario = (req, res, next) => {
    try {
        const { id, disponible,} = req.body;
        let errores = [];

        if (!id) errores.push('Es necesario definir el (id) del usuario.');
        if (!disponible) errores.push('Es necesario definir la (disponibilidad) del usuario.');

        if (errores.length > 0) {
            return res.status(400).json({ error: errores.join(' ') });
        }
        
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del usuario' });
    }
    next();
};




// Middleware para validar los datos de la api de google
exports.balidateUsuario = (req, res, next) => {
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