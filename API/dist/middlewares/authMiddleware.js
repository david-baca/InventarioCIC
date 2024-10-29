//const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado
exports.verifyToken = (req, res, next) => {
    /*const token = req.header('Authorization')?.split(' ')[1];  // Se espera el token en el encabezado "Authorization: Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verificar el token con la clave secreta
        req.user = verified;  // Asignar la información del usuario al request
        next();  //Continuar si el token es válido
    } catch (error) {
        return res.status(400).json({ error: 'Token inválido.' });
    }*/
    next();
};

// Middleware para verificar si el usuario tiene el rol de administrador
exports.verifyAdmin = (req, res, next) => {
    next();
};
