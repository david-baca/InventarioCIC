// src/views/articleView.js

exports.confirmacionCreacion = (articulo) => {
    return {
        mensaje: 'Artículo creado exitosamente',
        articulo
    };
};

exports.confirmacionEdicion = (articulo) => {
    return {
        mensaje: 'Artículo editado exitosamente',
        articulo
    };
};

exports.confirmacionBaja = (articulo) => {
    return {
        mensaje: 'Artículo dado de baja exitosamente',
        articulo
    };
};

exports.listaArticulos = (articulos) => {
    return {
        articulos
    };
};

exports.detallesArticulo = (articulo) => {
    return {
        articulo
    };
};

exports.errorArticulo = (mensaje) => {
    return {
        mensaje
    };
};
