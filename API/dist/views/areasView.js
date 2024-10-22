// src/views/areaView.js

exports.datosAreaCreada = (area) => {
    return {
        mensaje: 'Área creada exitosamente',
        area
    };
};

exports.confirmacionEdicion = (area) => {
    return {
        mensaje: 'Área editada exitosamente',
        area
    };
};

exports.confirmacionBaja = (area) => {
    return {
        mensaje: 'Área dada de baja exitosamente',
        area
    };
};

exports.listaAreas = (areas) => {
    return {
        areas
    };
};

exports.errorArea = (mensaje) => {
    return {
        mensaje
    };
};
