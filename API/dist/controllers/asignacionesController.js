// src/controllers/asignacionController.js
const asignacionView = require('../views/asignacionesView');
const { Asignaciones, Articulos, Responsables } = require('../model'); // Asegurándote de que todos los modelos están cargados correctamente

// const { Asignaciones } = require('../model')

let asignaciones = []; // Simulación de base de datos en memoria

// Buscar asignaciones por query
const { Op } = require('sequelize');

// Definir las relaciones solo para esta consulta, sin modificar los modelos globalmente
Asignaciones.belongsTo(Articulos, { foreignKey: 'Articulos_pk' });
Asignaciones.belongsTo(Responsables, { foreignKey: 'Responsables_pk' });

exports.buscarAsignaciones = async (req, res) => {
    const { query } = req.params;

    // Validar si el query está vacío
    if (!query.trim()) {
        return res.status(400).json({ error: 'El término de búsqueda no puede estar vacío.' });
    }

    try {
        // Realizar la búsqueda en la base de datos usando Sequelize
        const resultado = await Asignaciones.findAll({
            where: {
                disponible: true, // Solo mostrar asignaciones con 'disponible = true'
                [Op.or]: [
                    { Articulos_pk: { [Op.like]: `%${query}%` } },
                    { Responsables_pk: { [Op.like]: `%${query}%` } }
                ]
            },
            include: [
                {
                    model: Articulos, // Incluir detalles del artículo
                    attributes: ['nombre'], // Solo traer el nombre del artículo
                },
                {
                    model: Responsables, // Incluir detalles del responsable
                    attributes: ['nombres'], // Solo traer el nombre del responsable
                }
            ]
        });

        // Si no hay resultados, devolver un mensaje en JSON
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'No se encontraron asignaciones.' });
        }

        // Devolver el resultado en JSON
        return res.json(resultado);
    } catch (error) {
        // Mostrar el error en la consola para depurar
        console.error('Error al buscar asignaciones:', error);
        return res.status(500).json({ error: error.message });
    }
};


// Crear una nueva asignación
exports.crearAsignacion = async (req, res) => {
    const { fk_Articulo, fk_Responsable, urlDoc } = req.body;

    // Validar campos obligatorios
    if (!fk_Articulo || !fk_Responsable || !urlDoc) {
        return res.status(400).json({
            error: 'Todos los campos (fk_Articulo, fk_Responsable, urlDoc) son obligatorios.'
        });
    }

    try {
        // Verificar si ya existe una asignación con el mismo artículo o documento para el mismo responsable
        const asignacionExistente = await Asignaciones.findOne({
            where: {
                [Op.or]: [
                    { Articulos_pk: fk_Articulo, Responsables_pk: fk_Responsable },
                    { urlDoc: urlDoc, Responsables_pk: fk_Responsable }
                ]
            }
        });

        // Si ya existe una asignación, devolver un mensaje de error
        if (asignacionExistente) {
            return res.status(400).json({
                error: 'Este artículo o documento ya está asignado a este responsable. No se puede volver a asignar.'
            });
        }

        // Crear la nueva asignación en la base de datos
        const nuevaAsignacion = await Asignaciones.create({
            Articulos_pk: fk_Articulo,
            Responsables_pk: fk_Responsable,
            urlDoc: urlDoc,
            disponible: true, // Asignar disponible como true por defecto
            fecha_recibido: new Date() // Fecha de creación actual
        });

        // Obtener la asignación creada con los detalles del artículo y del responsable
        const asignacionConDetalles = await Asignaciones.findOne({
            where: { pk: nuevaAsignacion.pk },
            include: [
                {
                    model: require('../model').Articulos, // Incluir el modelo Articulos
                    attributes: ['nombre'] // Solo queremos el nombre del artículo
                },
                {
                    model: require('../model').Responsables, // Incluir el modelo Responsables
                    attributes: ['nombres', 'apellido_p', 'apellido_m'] // Obtener el nombre completo del responsable
                }
            ]
        });

        // Devolver la respuesta con los datos de la nueva asignación y los detalles
        return res.status(201).json({
            message: 'Asignación creada exitosamente.',
            asignacion: asignacionConDetalles
        });
    } catch (error) {
        // Manejar posibles errores
        console.error('Error al crear la asignación:', error);
        return res.status(500).json({
            error: 'Error al crear la asignación.'
        });
    }
};



// Dar de baja una asignación por ID
exports.darDeBajaAsignacion = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json(asignacionView.errorAsignacion('No existe la asignacion solicitada.'));
    }

    const index = asignaciones.findIndex(a => a.id == id);

    if (index === -1) {
        return res.status(404).json(asignacionView.errorAsignacion('Asignación no encontrada.'));
    }

    const asignacionBaja = asignaciones[index];
    asignaciones.splice(index, 1);
    Asignaciones.delete(asignacionBaja);

    res.json(asignacionView.confirmacionBaja(asignacionBaja));
};

// Obtener detalles de una asignación por ID
exports.obtenerDetallesAsignacion = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json(asignacionView.errorAsignacion('No se encontro la asignacion solicitada.'));
    }

    const asignacion = asignaciones.find(a => a.id == id);

    if (!asignacion) {
        return res.status(404).json(asignacionView.errorAsignacion('Asignación no encontrada.'));
    }

    res.json(asignacionView.detallesAsignacion(asignacion));
};

// Registro de asignaciones por Artículo
exports.registroAsignacionesPorArticulo = (req, res) => {
    const { fk_Articulo } = req.params;

    // Validar que el artículo existe y tiene formato adecuado
    if (!fk_Articulo || !fk_Articulo.startsWith('UPQROO-')) {
        return res.status(400).json(asignacionView.errorAsignacion('El artículo es inválido o no sigue el formato correcto.'));
    }

    const resultado = asignaciones.filter(a => a.fk_Articulo == fk_Articulo);

    // Si no se encuentran asignaciones
    if (resultado.length === 0) {
        return res.status(404).json(asignacionView.errorAsignacion('No se encontraron asignaciones para este artículo.'));
    }

    res.json(asignacionView.listaAsignaciones(resultado));
};

// Registro de asignaciones por Responsable
exports.registroAsignacionesPorResponsable = (req, res) => {
    const { fk_Responsable } = req.params;

    // Validar que el responsable sea un ID numérico válido
    if (isNaN(fk_Responsable)) {
        return res.status(400).json(asignacionView.errorAsignacion('No se encontro al responsable.'));
    }

    const resultado = asignaciones.filter(a => a.fk_Responsable == fk_Responsable);

    // Si no se encuentran asignaciones
    if (resultado.length === 0) {
        return res.status(404).json(asignacionView.errorAsignacion('No se encontraron asignaciones para este responsable.'));
    }

    res.json(asignacionView.listaAsignaciones(resultado));
};
