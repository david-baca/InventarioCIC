// src/controllers/articleController.js
const articleView = require('../views/articulosView');

let articulos = []; // Simulación de base de datos en memoria

exports.buscarArticulos = (req, res) => {
    const { query } = req.params;
    const resultado = articulos.filter(a => a.nombre.includes(query) || a.descripcion.includes(query));

    res.json(articleView.listaArticulos(resultado));
};

exports.crearArticulo = (req, res) => {
    const { no_inventario, nombre, descripcion, costo, consumible, area, grupo } = req.body;
    
    const nuevoArticulo = { id: articulos.length + 1, no_inventario, nombre, descripcion, costo, consumible, area, grupo };
    articulos.push(nuevoArticulo);

    res.json(articleView.confirmacionCreacion(nuevoArticulo));
};

exports.editarArticulo = (req, res) => {
    const { id } = req.params;
    const { no_inventario, nombre, descripcion, costo, consumible } = req.body;

    const articulo = articulos.find(a => a.id == id);
    if (!articulo) {
        return res.status(404).json(articleView.errorArticulo('Artículo no encontrado'));
    }

    articulo.no_inventario = no_inventario;
    articulo.nombre = nombre;
    articulo.descripcion = descripcion;
    articulo.costo = costo;
    articulo.consumible = consumible;

    res.json(articleView.confirmacionEdicion(articulo));
};

exports.darDeBajaArticulo = (req, res) => {
    const { id } = req.params;
    const { imagenes, motivo } = req.body;

    const index = articulos.findIndex(a => a.id == id);
    if (index === -1) {
        return res.status(404).json(articleView.errorArticulo('Artículo no encontrado'));
    }

    const articuloBaja = articulos[index];
    articulos.splice(index, 1);

    res.json(articleView.confirmacionBaja(articuloBaja));
};

exports.detallesArticulo = (req, res) => {
    const { no_inventario } = req.params;
    const articulo = articulos.find(a => a.no_inventario === no_inventario);

    if (!articulo) {
        return res.status(404).json(articleView.errorArticulo('Artículo no encontrado'));
    }

    res.json(articleView.detallesArticulo(articulo));
};

exports.articulosSinGrupo = (req, res) => {
    const { fk_Grupo_execpcion } = req.params;
    const resultado = articulos.filter(a => a.grupo !== fk_Grupo_execpcion);

    res.json(articleView.listaArticulos(resultado));
};

exports.articulosSinArea = (req, res) => {
    const { fk_Area_execpcion } = req.params;
    const resultado = articulos.filter(a => a.area !== fk_Area_execpcion);

    res.json(articleView.listaArticulos(resultado));
};
