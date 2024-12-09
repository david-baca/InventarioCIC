// src/controllers/authController.js
const authView = require('../views/authView');
 
exports.iniciarSesion = (req, res) => {
    const { correo, token } = req.body;

    // Aquí iría la lógica de autenticación con Google
    // Simulando una respuesta de autenticación exitosa
    const estado = {
        correo,
        token,
        mensaje: 'Usuario autenticado'
    };

    res.json(authView.estadoAutenticacion(estado));
};

exports.cerrarSesion = (req, res) => {
    const { token } = req.body;
    // Aquí iría la lógica para cerrar sesión
    // Simulando una respuesta de cierre de sesión exitoso
    res.json(authView.confirmacionLogout());
};
