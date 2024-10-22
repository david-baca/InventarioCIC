// src/views/userView.js

exports.confirmacionCreacion = (usuario) => {
    return {
        mensaje: 'Usuario creado exitosamente',
        usuario
    };
};

exports.confirmacionEdicion = (usuario) => {
    return {
        mensaje: 'Usuario editado exitosamente',
        usuario
    };
};

exports.listaUsuarios = (usuarios) => {
    return {
        usuarios
    };
};

exports.detallesUsuario = (usuario) => {
    return {
        usuario
    };
};

exports.errorUsuario = (mensaje) => {
    return {
        mensaje
    };
};
