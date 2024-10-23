// src/controllers/articleController.js
const articleView = require('../views/articulosView');
const { Articulos } = require('../model');

exports.buscarArticulos = async (req, res) => {
    const { query } = req.params;
    try {
        const resultado = await Articulos.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { descripcion: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1 // Solo buscar artículos disponibles
            }
        });
        res.json(articleView.listaArticulos(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de artículos' });
    }
};

exports.crearArticulo = async (req, res) => {
    const { no_inventario, nombre, descripcion, costo, consumible, area, grupo } = req.body;
    try {
        const nuevoArticulo = await Articulos.create({
            no_inventario,
            nombre,
            descripcion,
            costo,
            consumible,
            Area_pk: area, // Asumiendo que pasas el ID del área
            Grupos_pk: grupo // Asumiendo que pasas el ID del grupo
        });
        res.json(articleView.confirmacionCreacion(nuevoArticulo));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el artículo' });
    }
};

exports.editarArticulo = async (req, res) => {
    const { id } = req.params;
    const { no_inventario, nombre, descripcion, costo, consumible } = req.body;

    try {
        const articulo = await Articulos.findByPk(id);
        if (!articulo) {
            return res.status(404).json(articleView.errorArticulo('Artículo no encontrado'));
        }

        await articulo.update({ no_inventario, nombre, descripcion, costo, consumible });

        res.json(articleView.confirmacionEdicion(articulo));
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el artículo' });
    }
};

exports.darDeBajaArticulo = async (req, res) => {
    const { id } = req.params;
    const { imagenes, motivo } = req.body;

    try {
        const articulo = await Articulos.findByPk(id);
        if (!articulo) {
            return res.status(404).json(articleView.errorArticulo('Artículo no encontrado'));
        }

        await articulo.update({ disponible: 0 }); // Marcar como no disponible
        res.json(articleView.confirmacionBaja(articulo));
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el artículo' });
    }
};

exports.detallesArticulo = async (req, res) => {
    const { no_inventario } = req.params;

    try {
        const articulo = await Articulos.findOne({
            where: { no_inventario, disponible: 1 }
        });

        if (!articulo) {
            return res.status(404).json(articleView.errorArticulo('Artículo no encontrado'));
        }

        res.json(articleView.detallesArticulo(articulo));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del artículo' });
    }
};

exports.articulosSinGrupo = async (req, res) => {
    const { fk_Grupo_execpcion } = req.params;

    try {
        const resultado = await Articulos.findAll({
            where: {
                Grupos_pk: { [Op.ne]: fk_Grupo_execpcion },
                disponible: 1
            }
        });
        res.json(articleView.listaArticulos(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos sin grupo' });
    }
};

exports.articulosSinArea = async (req, res) => {
    const { fk_Area_execpcion } = req.params;

    try {
        const resultado = await Articulos.findAll({
            where: {
                Area_pk: { [Op.ne]: fk_Area_execpcion },
                disponible: 1
            }
        });
        res.json(articleView.listaArticulos(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos sin área' });
    }
};

/*
const areaView = require('../views/areasView');
const { Areas } = require('../model'); // Asegúrate de tener el modelo Areas importado
const { Op } = require('sequelize');

exports.crearArea = async (req, res) => {
    const { codigo, descripcion } = req.body;

    try {
        const nuevaArea = await Areas.create({ codigo, descripcion });
        res.json(areaView.datosAreaCreada(nuevaArea));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el área' });
    }
};

exports.editarArea = async (req, res) => {
    const { id } = req.params;
    const { codigo, descripcion } = req.body;

    try {
        const area = await Areas.findByPk(id);
        if (!area) {
            return res.status(404).json(areaView.errorArea('Área no encontrada'));
        }

        await area.update({ codigo, descripcion });
        res.json(areaView.confirmacionEdicion(area));
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el área' });
    }
};

exports.buscarAreas = async (req, res) => {
    const { query } = req.params;

    try {
        const resultado = await Areas.findAll({
            where: {
                [Op.or]: [
                    { codigo: { [Op.like]: `%${query}%` } },
                    { descripcion: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1 // Solo buscar áreas disponibles
            }
        });
        res.json(areaView.listaAreas(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de áreas' });
    }
};

exports.darDeBajaArea = async (req, res) => {
    const { id } = req.params;

    try {
        const area = await Areas.findByPk(id);
        if (!area) {
            return res.status(404).json(areaView.errorArea('Área no encontrada'));
        }

        await area.update({ disponible: 0 }); // Marcar como no disponible
        res.json(areaView.confirmacionBaja(area));
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el área' });
    }
};
*/