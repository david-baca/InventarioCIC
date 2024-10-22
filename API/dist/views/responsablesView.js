// src/views/responsableView.js

exports.datosResponsableCreado = (responsable) => {
    return {
        mensaje: 'Responsable creado exitosamente',
        responsable
    };
};

exports.confirmacionEdicion = (responsable) => {
    return {
        mensaje: 'Responsable editado exitosamente',
        responsable
    };
};

exports.confirmacionBaja = (responsable) => {
    return {
        mensaje: 'Responsable dado de baja exitosamente',
        responsable
    };
};

exports.listaResponsables = (responsables) => {
    return {
        responsables
    };
};

exports.errorResponsable = (mensaje) => {
    return {
        mensaje
    };
};
