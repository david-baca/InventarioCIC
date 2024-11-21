// src/controllers/areaController.js
const areaView = require('../views/areaView');
const { Areas } = require('../model');
const { Op } = require('sequelize');

// Crear área
exports.crearArea = async (req, res) => {
    const { codigo, descripcion } = req.body;
    if (!codigo || !descripcion) {
        return res.status(400).json({
            error: 'Faltan datos requeridos: código y descripción son obligatorios.'
        });
    }
    const disponible = 1;  // El área se crea disponible
    try {
        const area = await Areas.create({ codigo, descripcion, disponible });
        res.status(201).json(areaView.datosAreaCreada(area));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editar área
exports.editarArea = async (req, res) => {
    try {
        const area = await Areas.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }
        const { codigo, descripcion } = req.body;
        if (!codigo || !descripcion) {
            return res.status(400).json({
                error: 'Faltan datos requeridos: código y descripción son obligatorios.'
            });
        }
        await area.update({ codigo, descripcion });
        res.status(200).json(areaView.confirmacionEdicion(area));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar áreas
exports.buscarAreas = async (req, res) => {
    try {
        const { query } = req.params;
        const areas = await Areas.findAll({
            where: {
                [Op.or]: [
                    { codigo: query },
                    { descripcion: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        if (areas.length > 0) {
            res.status(200).json(areaView.listaAreas(areas));
        } else {
            res.status(404).json({ message: 'No se encontraron áreas.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Dar de baja área
exports.darDeBajaArea = async (req, res) => {
    try {
        const area = await Areas.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }

        const { motivo } = req.body;
        if (!motivo) {
            return res.status(400).json({ error: 'Es necesario especificar un motivo para dar de baja el área.' });
        }

        await area.update({ disponible: false, motivo });
        res.status(200).json(areaView.confirmacionBaja(area));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
