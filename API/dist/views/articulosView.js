exports.listaArticulos = (articulos) => {
    return articulos.map(articulo => ({
        pk: articulo.pk,
        no_inventario: articulo.no_inventario,
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        costo: articulo.costo,
        consumible: articulo.consumible,
        disponible: articulo.disponible,
    }));
};

exports.errorArticulo = (message) => {
    return { error: message };
};

exports.confirmacionEdicion = (articulo) => {
    return { message: 'Artículo editado exitosamente', articulo };
};

exports.confirmacionBaja = (articulo) => {
    return { message: 'Artículo dado de baja exitosamente', articulo };
};

exports.detallesArticulo = (articulo) => {
    return {
        pk: articulo.pk,
        no_inventario: articulo.no_inventario,
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        costo: articulo.costo,
        consumible: articulo.consumible,
        disponible: articulo.disponible,
    };
};
