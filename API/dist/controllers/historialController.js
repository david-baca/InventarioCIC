const { Historial, Usuarios } = require('../model'); // Asegúrate de tener el modelo Grupos importado
const { Op } = require('sequelize');
// Buscar grupos
exports.buscarHistoricos = async (req, res) => {
    const { query } = req.params; // Extraemos el query
    try {
        const whereConditions = {};
        if (query && query !== 'null' && query !== '') {
            whereConditions[Op.or] = [
                { descripcion: { [Op.like]: `%${query}%` } },
            ];
        }
        const resultado = await Historial.findAll({
            where: whereConditions,
            include:[{
                model:Usuarios,
                as: 'Usuario',
            }],
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de historicos' });
    }
};
