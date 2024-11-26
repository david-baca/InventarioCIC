// src/views/grupoView.js

exports.datosGrupoCreado = (grupo) => {
    return {
        mensaje: 'Grupo creado exitosamente',
        grupo
    };
};

exports.confirmacionEdicion = (grupo) => {
    return {
        message: 'Grupo editado exitosamente',
        grupo
    };
};

exports.confirmacionBaja = (grupo) => {
    return {
        mensaje: 'Grupo dado de baja exitosamente',
        grupo
    };
};

exports.listaGrupos = (grupos) => {
    return {
        grupos
    };
};

exports.errorGrupo = (mensaje) => {
    return {
        mensaje
    };
};
