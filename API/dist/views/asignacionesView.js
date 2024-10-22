// src/views/asignacionView.js

exports.datosAsignacionCreada = (asignacion) => {
    return {
        mensaje: 'Asignación creada exitosamente',
        asignacion
    };
};

exports.confirmacionBaja = (asignacion) => {
    return {
        mensaje: 'Asignación dada de baja exitosamente',
        asignacion
    };
};

exports.detallesAsignacion = (asignacion) => {
    return {
        asignacion
    };
};

exports.listaAsignaciones = (asignaciones) => {
    return {
        asignaciones
    };
};

exports.errorAsignacion = (mensaje) => {
    return {
        mensaje
    };
};
