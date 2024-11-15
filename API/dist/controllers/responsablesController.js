const responsableView = require('../views/responsablesView');
const { Responsables, Asignaciones, Articulos, Documentos } = require('../model'); // Asegúrate de tener el modelo Responsables importado
const { Op } = require('sequelize');

exports.buscarResponsable=async(req,res)=>{
    const { pk } = req.params;
    try {
        const responsable = await Responsables.findOne({
            where: { pk: pk },
            include: [
                {
                    where: { disponible: 1 },
                    required: false,
                    model: Asignaciones,
                    as: 'Asignaciones',
                    include:[{
                        model:Articulos,
                        as: 'Articulo',
                    }],
                    include:[{
                        model:Documentos,
                        as: 'Documentos',
                    }]
                }
            ]
        });
        // Check if any articles were found
        if (responsable === null) {
            return res.status(404).json({ error: 'responsable no encontrado' });
        }
        res.json({ responsable });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del responsable: ' + error.message });
    }
}

exports.crearResponsable = async (req, res) => {
    const { nombres, apellido_p, apellido_m, correo } = req.body;
    try { 
        const nuevoResponsable = await Responsables.create({
            nombres:nombres,
            apellido_p:apellido_p,
            apellido_m:apellido_m,
            correo: correo,
            disponible:1
        });
        res.json(responsableView.datosResponsableCreado(nuevoResponsable));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el responsable' });
    }
};

exports.editarResponsable = async (req, res) => {
    const { id } = req.params;
    const { nombres, apellido_p, apellido_m, correo } = req.body;
    try {
        const responsable = await Responsables.findByPk(id);
        if (!responsable) {
            return res.status(404).json(responsableView.errorResponsable('Responsable no encontrado'));
        }

        await responsable.update({ correo, nombres, apellido_p, apellido_m });
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
                    { apellido_m: { [Op.like]: `%${query}%` } },
                    { correo: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1 // Solo buscar responsables disponibles
            },
            attributes: ['pk','nombres','apellido_p','apellido_m', 'correo']
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de responsables' });
    }
};

exports.buscarResponsablesAll = async (req, res) => {
try {
    const resultado = await Responsables.findAll({
        where: {disponible: 1},
        attributes: ['pk','nombres','apellido_p','apellido_m', 'correo']
    });
    res.json(resultado);
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
