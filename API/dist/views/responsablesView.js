// src/views/responsableView.js

exports.datosResponsableCreado = (responsable) => {
    return {
        message: 'Responsable creado exitosamente',
        responsable
    };
};

exports.confirmacionEdicion = (responsable) => {
    return {
        message: 'Responsable editado exitosamente',
        responsable
    };
};

exports.confirmacionBaja = (responsable) => {
    return {
        message: 'Responsable dado de baja exitosamente',
        responsable
    };
};

exports.listaResponsables = (responsables) => {
    return {
        responsables
    };
};

exports.errorResponsable = (message) => {
    return {
        message
    };
};
