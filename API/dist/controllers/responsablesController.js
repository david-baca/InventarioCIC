const responsableView = require('../views/responsablesView');
const { Responsables } = require('../model'); // Asegúrate de tener el modelo Responsables importado
const { Op } = require('sequelize');

exports.crearResponsable = async (req, res) => {
    const { nombres, apellido_p, apellido_m, cargo, disponible } = req.body;

    try {
        const nuevoResponsable = await Responsables.create({
            nombres,
            apellido_p,
            apellido_m,
            cargo,
            disponible
        });
        res.json(responsableView.datosResponsableCreado(nuevoResponsable));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el responsable' });
    }
};

exports.editarResponsable = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellido_p, apellido_m, cargo } = req.body;

    try {
        const responsable = await Responsables.findByPk(id);
        if (!responsable) {
            return res.status(404).json(responsableView.errorResponsable('Responsable no encontrado'));
        }

        await responsable.update({ nombres, apellido_p, apellido_m, cargo });
        res.json(responsableView.confirmacionEdicion(responsable));
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el responsable' });
    }
};

exports.buscarResponsables = async (req, res) => {
    const { query } = req.params;

    try {
        const resultado = await Responsables.findAll({
            where: {
                [Op.or]: [
                    { nombres: { [Op.like]: `%${query}%` } },
                    { apellido_p: { [Op.like]: `%${query}%` } },
                    { apellido_m: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1 // Solo buscar responsables disponibles
            }
        });
        res.json(responsableView.listaResponsables(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de responsables' });
    }
};

exports.darDeBajaResponsable = async (req, res) => {
    const { id } = req.params;

    try {
        const responsable = await Responsables.findByPk(id);
        if (!responsable) {
            return res.status(404).json(responsableView.errorResponsable('Responsable no encontrado'));
        }

        await responsable.update({ disponible: 0 }); // Marcar como no disponible
        res.json(responsableView.confirmacionBaja(responsable));
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el responsable' });
    }
};
