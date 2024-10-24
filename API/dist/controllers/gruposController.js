const grupoView = require('../views/gruposView');
const { Grupos } = require('../model'); // Asegúrate de tener el modelo Grupos importado
const { Op } = require('sequelize');

exports.buscarGrupos = async (req, res) => {
    const { query } = req.params;
    try {
        const resultado = await Grupos.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { descripcion: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1 // Solo buscar grupos disponibles
            }
        });
        res.json(grupoView.listaGrupos(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de grupos' });
    }
};

exports.crearGrupo = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const nuevoGrupo = await Grupos.create({ nombre, descripcion });
        res.json(grupoView.datosGrupoCreado(nuevoGrupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
};

exports.editarGrupo = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const grupo = await Grupos.findByPk(id);
        if (!grupo) {
            return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
        }

        await grupo.update({ nombre, descripcion });
        res.json(grupoView.confirmacionEdicion(grupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el grupo' });
    }
};

exports.darDeBajaGrupo = async (req, res) => {
    const { id } = req.params;

    try {
        const grupo = await Grupos.findByPk(id);
        if (!grupo) {
            return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
        }

        await grupo.update({ disponible: 0 }); // Marcar como no disponible
        res.json(grupoView.confirmacionBaja(grupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el grupo' });
    }
};
