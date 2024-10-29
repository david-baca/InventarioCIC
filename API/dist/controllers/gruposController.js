const grupoView = require('../views/gruposView');
const { Grupos, Articulos } = require('../model'); // Asegúrate de tener el modelo Grupos importado
const { Op } = require('sequelize');
// Buscar grupos
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
// Detalles de un grupo en espesifico
exports.detallesGrupo = async (req, res) => {
    const { pk } = req.params;
    try {
        const grupo = await Grupos.findByPk(pk)
        if(grupo=== undefined) return res.status(404).json({ error: 'Grupo no encontrado' });
        const articulos = await Articulos.findAll({
            where: { Grupos_pk: pk },
        });
        res.json({ articulos, grupo });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del artículo: ' + error.message });
    }
};
// Crear un nuevo grupo
exports.crearGrupo = async (req, res) => {
    const { nombre, descripcion, articulos } = req.body; // Captura la lista de artículos
    try {
        const nuevoGrupo = await Grupos.create({ nombre, descripcion });

        // Actualizar los artículos con el nuevo grupo
        if (articulos && articulos.length > 0) {
            await Articulos.update(
                { Grupos_pk: nuevoGrupo.pk }, // Asocia el nuevo grupo
                { where: { pk: articulos.map(articulo => articulo.pk) } }
            );
        }

        res.json(grupoView.datosGrupoCreado(nuevoGrupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
};

// Editar un grupo existente
exports.editarGrupo = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, articulos } = req.body; // Captura la lista de artículos
    try {
        const grupo = await Grupos.findByPk(id);
        if (!grupo) {
            return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
        }
        // Actualiza los detalles del grupo
        await grupo.update({ nombre, descripcion });
        // Actualizar los artículos con el nuevo grupo
        if (articulos && articulos.length > 0) {
            await Articulos.update(
                { Grupos_pk: grupo.pk }, // Asocia el grupo editado
                { where: { pk: articulos.map(articulo => articulo.pk) } }
            );
        }

        res.json(grupoView.confirmacionEdicion(grupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el grupo' });
    }
};

// Dar de baja un grupo
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
