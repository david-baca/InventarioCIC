// src/views/authView.js

exports.estadoAutenticacion = (estado) => {
    return {
        mensaje: 'Inicio de sesión exitoso',
        estado
    };
};

exports.confirmacionLogout = () => {
    return {
        mensaje: 'Cierre de sesión exitoso'
    };
};

exports.errorAutenticacion = (mensaje) => {
    return {
        mensaje
    };
};
