const { Articulos, Condiciones, Imagenes, Areas, Grupos, Asignaciones } = require('../model');
const { Op } = require('sequelize');

exports.buscarArticulos = async (req, res) => {
    const { query } = req.params;
    try {
        const resultado = await Articulos.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { descripcion: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1
            }
        });
        res.json({ articulos: resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de artículos' });
    }
}; 

exports.crearArticulo = async (req, res) => {
    try {
        const { no_inventario, nombre, descripcion, costo } = req.body;
        const nuevoArticulo = await Articulos.create({
            no_inventario,
            nombre,
            descripcion,
            costo,
            consumible: 1,
            disponible: 1,
        });
        if (req.files && req.files.length > 0) {
            const nuevaCondicion = await Condiciones.create({
                Articulos_pk: nuevoArticulo.pk,
                fecha: new Date(),
                disponible: 1,
            });
            const imagenesData = req.files.map(file => {
                return {
                    imagen: file.path,
                    Condiciones_pk: nuevaCondicion.pk,
                };
            });
            await Imagenes.bulkCreate(imagenesData);
        }
        res.json({ message: 'Artículo creado exitosamente', articulo: nuevoArticulo });
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
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        await articulo.update({ no_inventario, nombre, descripcion, costo, consumible });
        res.json({ message: 'Artículo editado exitosamente', articulo });
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el artículo' });
    }
};

exports.darDeBajaArticulo = async (req, res) => {
    const { id } = req.params;
    try {
        const articulo = await Articulos.findByPk(id);
        if (!articulo) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        await articulo.update({ disponible: 0 });
        res.json({ message: 'Artículo dado de baja exitosamente', articulo });
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el artículo' });
    }
};

exports.detallesArticulo = async (req, res) => {
    const { no_inventario } = req.params;
    console.log(no_inventario);
    try {
        const articulos = await Articulos.findAll({
            where: { no_inventario: no_inventario },
            include: [
                {
                    model: Condiciones,
                    as: 'Condiciones'
                },
                {
                    model: Areas,
                    as: 'Area'
                },
                {
                    model: Grupos,
                    as: 'Grupo'
                }
            ]
        });

        // Check if any articles were found
        if (articulos.length === 0) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }

        const articulo = articulos[0]; // Get the first article
        const responsable = await Asignaciones.findAll({
            where: { Articulos_pk: articulo.pk, disponible: 1 }
        });

        const respuesta = { articulo, responsable };
        res.json({ respuesta });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del artículo: ' + error.message });
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
        res.json({ articulos: resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos sin grupo' });
    }
};

exports.articulosSinArea = async (req, res) => {
    const { fk_Area_execpcion } = req.params;

    try {
        const resultado = await Articulos.findAll({
            where: {
                Areas_pk: { [Op.ne]: fk_Area_execpcion },
                disponible: 1
            }
        });
        res.json({ articulos: resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos sin área' });
    }
};
