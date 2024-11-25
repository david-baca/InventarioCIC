// src/controllers/areaController.js
const areaView = require('../views/areasView');
const { Areas, Articulos } = require('../model');
const { Op } = require('sequelize');
exports.buscarAreas = async (req, res) => {
    const { query } = req.params;
    try {
        const whereConditions = {
            disponible: 1 // Solo buscar áreas disponibles
        };
        if (query && query !== 'null' && query !== '') {
            whereConditions[Op.or] = [
                { codigo: { [Op.like]: `%${query}%` } },  // Cambiado de 'nombre' a 'codigo'
                { descripcion: { [Op.like]: `%${query}%` } }
            ];
        }
        const resultado = await Areas.findAll({
            where: whereConditions
        });
        res.json(areaView.listaAreas(resultado)); // Adaptado a 'areaView'
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de áreas' });
    }
};
exports.detallesArea = async (req, res) => {
    const { pk } = req.params;
    try {
        const area = await Areas.findByPk(pk);
        if (area === undefined) return res.status(404).json({ error: 'Área no encontrada' });
        const articulos = await Articulos.findAll({
            where: { Area_pk: pk },
        });
        res.json({ articulos, area });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del área: ' + error.message });
    }
};
exports.crearArea = async (req, res) => {
    const { codigo, descripcion, articulos } = req.body; // Captura la lista de artículos
    try {
        const nuevaArea = await Areas.create({ codigo, descripcion });

        // Actualizar los artículos con la nueva área
        if (articulos && articulos.length > 0) {
            await Articulos.update(
                { Area_pk: nuevaArea.pk }, // Asocia la nueva área
                { where: { pk: articulos.map(articulo => articulo.pk) } }
            );
        }

        res.json(areaView.datosAreaCreada(nuevaArea)); // Adaptado a 'areaView'
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el área'+error });
    }
};
exports.editarArea = async (req, res) => {
    const { id } = req.params;
    const { codigo, descripcion, articulos } = req.body; // Captura la lista de artículos (pks)
    
    try {
        const area = await Areas.findByPk(id);
        if (!area) {
            return res.status(404).json(areaView.errorArea('Área no encontrada'));
        }
        await area.update({ codigo, descripcion });

        await Articulos.update(
            { Area_pk: null },  // Establece el campo Area_pk a null
            { where: { Area_pk: area.pk } }  // Solo actualizamos los artículos que están actualmente asignados a esta área
        );

        // Ahora, asociamos los artículos seleccionados al área editada
        if (articulos && articulos.length > 0) {
            for (let i = 0; i < articulos.length; i++) {
                const x = await Articulos.findByPk(articulos[i]);  // Encuentra el artículo por su PK
                if (x) {
                    x.Area_pk = area.pk;
                    await x.save();  // Guarda los cambios
                } else {
                    console.log(`No se encontró el artículo con PK ${articulos[i]}`);
                }
            }
        }

        res.json(areaView.confirmacionEdicion(area)); // Adaptado a 'areaView'
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el área: ' + error });
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
        res.json(areaView.confirmacionBaja(area)); // Adaptado a 'areaView'
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el área' });
    }
};