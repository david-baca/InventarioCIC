// src/controllers/asignacionController.js
const asignacionView = require('../views/asignacionesView');
const { Documentos, Asignaciones, Articulos, Responsables, Historial } = require('../model');

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
        // Verificar si ya existe una asignación con el mismo artículo y responsable
        const asignacionExistente = await Asignaciones.findOne({
            where: {
                Articulos_pk: fk_Articulo,
                Responsables_pk: fk_Responsable
            }
        });

        // Si ya existe una asignación, verificar si el documento también existe
        if (asignacionExistente) {
            const documentoExistente = await Documentos.findOne({
                where: {
                    doc_firma: urlDoc,
                    Asignaciones_pk: asignacionExistente.pk
                }
            });

            if (documentoExistente) {
                return res.status(400).json({
                    error: 'Este artículo ya está asignado a este responsable con el mismo documento. No se puede volver a asignar.'
                });
            }
        }

        // Crear la nueva asignación en la base de datos
        const nuevaAsignacion = await Asignaciones.create({
            Articulos_pk: fk_Articulo,
            Responsables_pk: fk_Responsable,
            disponible: true,
            fecha_recibido: new Date()
        });

        // Crear el documento vinculado a la asignación
        const nuevoDocumento = await Documentos.create({
            doc_firma: urlDoc, // Guardar el URL del documento
            fecha: new Date(),
            Asignaciones_pk: nuevaAsignacion.pk
        });

        // Obtener la asignación creada con los detalles del artículo, responsable y documento
        const asignacionConDetalles = await Asignaciones.findOne({
            where: { pk: nuevaAsignacion.pk },
            include: [
                {
                    model: Articulos,
                    attributes: ['nombre']
                },
                {
                    model: Responsables,
                    attributes: ['nombres', 'apellido_p', 'apellido_m']
                },
                {
                    model: Documentos,
                    as: 'Documentos', // Especifica el alias aquí
                    attributes: ['doc_firma', 'fecha']
                }
            ]
        });

        // Devolver la respuesta con los datos de la nueva asignación y los detalles
        return res.status(201).json({
            message: 'Asignación creada exitosamente.',
            asignacion: asignacionConDetalles,
            documento: nuevoDocumento
        });
    } catch (error) {
        console.error('Error al crear la asignación:', error);
        return res.status(500).json({
            error: `Error al crear la asignación: ${error.message}`
        });
    }
};

// Dar de baja una asignación por ID
exports.darDeBajaAsignacion = async (req, res) => {
    console.log('Parametros de la URL:', req.params); // Verificar que el id está siendo recibido
    const { id } = req.params; // Obtener el id de los parámetros de la URL
    console.log('ID capturado:', id);

    const { motivo, usuarioId } = req.body; // Obtener el motivo de baja y el usuario que realiza la acción
    console.log('Motivo:', motivo);
    console.log('Usuario ID:', usuarioId);

    // Validar si el ID es numérico
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID de la asignación es inválido.' });
    }

    try {
        // Buscar la asignación en la base de datos
        const asignacion = await Asignaciones.findOne({
            where: { pk: id }
        });

        // Si no se encuentra la asignación
        if (!asignacion) {
            return res.status(404).json({ error: 'Asignación no encontrada.' });
        }

        // Crear un registro en la tabla Historial con la baja
        const historialRegistro = await Historial.create({
            descripcion: motivo || 'Asignación dada de baja',
            fecha_accion: new Date(),
            Usuarios_pk: usuarioId, // El usuario que realiza la acción
            disponible: false, // Indica que la asignación ha sido dada de baja
            Asignaciones_pk: asignacion.pk // Relaciona el historial con la asignación
        });

        // Respuesta de confirmación
        return res.json({
            message: 'Asignación dada de baja exitosamente y registrada en el historial.',
            historial: historialRegistro
        });
    } catch (error) {
        console.error('Error al dar de baja la asignación:', error);
        return res.status(500).json({ error: 'Error al dar de baja la asignación.' });
    }
};

// Obtener detalles de una asignación por ID
exports.obtenerDetallesAsignacion = async (req, res) => {
    const { id } = req.params;

    // Validar si el ID es numérico
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID de la asignación debe ser un número válido.' });
    }

    try {
        // Buscar la asignación en la base de datos con el ID proporcionado
        const asignacion = await Asignaciones.findOne({
            where: { pk: id }, // Buscar por ID de la asignación
            include: [
                {
                    model: Responsables, // Incluir el responsable
                    as: 'Responsable', // Usa el alias correcto si has definido uno
                    attributes: ['nombres', 'apellido_p', 'apellido_m'] // Atributos que deseas mostrar
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos', // Usa el alias correcto
                    attributes: ['doc_firma', 'fecha'] // Atributos que deseas mostrar
                },
                {
                    model: Articulos, // Incluir los artículos relacionados
                    as: 'Articulo', // Usa el alias correcto
                    attributes: ['nombre', 'descripcion'] // Atributos que deseas mostrar
                }
            ]
        });

        // Si no se encuentra la asignación, devolver un error 404
        if (!asignacion) {
            return res.status(404).json({ error: 'Asignación no encontrada.' });
        }

        // Devolver la asignación en formato JSON
        return res.json(asignacion);
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los detalles de la asignación:', error);
        return res.status(500).json({ error: 'Error al obtener los detalles de la asignación.' });
    }
};

// Registro de asignaciones por Artículo
exports.registroAsignacionesPorArticulo = async (req, res) => {
    const { fk_Articulo } = req.params;

    // Validar que el artículo está presente
    if (!fk_Articulo) {
        return res.status(400).json({ error: 'El artículo es inválido o no se proporcionó.' });
    }

    try {
        // Buscar asignaciones relacionadas con el artículo en la base de datos
        const asignaciones = await Asignaciones.findAll({
            where: { Articulos_pk: fk_Articulo }, // Filtrar por el número del artículo
            include: [
                {
                    model: Articulos, // Incluir los detalles del artículo
                    as: 'Articulo',
                    attributes: ['nombre', 'descripcion']
                },
                {
                    model: Responsables, // Incluir los detalles del responsable
                    as: 'Responsable',
                    attributes: ['nombres', 'apellido_p', 'apellido_m']
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos',
                    attributes: ['doc_firma', 'fecha']
                }
            ]
        });

        // Si no se encuentran asignaciones para ese artículo
        if (!asignaciones || asignaciones.length === 0) {
            return res.status(404).json({ error: 'No se encontraron asignaciones para este artículo.' });
        }

        // Devolver la lista de asignaciones en formato JSON
        return res.json(asignaciones);
    } catch (error) {
        console.error('Error al obtener asignaciones por artículo:', error);
        return res.status(500).json({ error: 'Error al obtener asignaciones por artículo.' });
    }
};

// Registro de asignaciones por Responsable
exports.registroAsignacionesPorResponsable = async (req, res) => {
    const { fk_Responsable } = req.params;

    // Validar que el fk_Responsable es un número válido
    if (isNaN(fk_Responsable)) {
        return res.status(400).json({ error: 'El ID del responsable es inválido.' });
    }

    try {
        // Buscar asignaciones relacionadas con el responsable en la base de datos
        const asignaciones = await Asignaciones.findAll({
            where: { Responsables_pk: fk_Responsable }, // Filtrar por el ID del responsable
            include: [
                {
                    model: Articulos, // Incluir los detalles del artículo
                    as: 'Articulo',
                    attributes: ['nombre', 'descripcion']
                },
                {
                    model: Responsables, // Incluir los detalles del responsable
                    as: 'Responsable',
                    attributes: ['nombres', 'apellido_p', 'apellido_m']
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos',
                    attributes: ['doc_firma', 'fecha']
                }
            ]
        });

        // Si no se encuentran asignaciones para ese responsable
        if (!asignaciones || asignaciones.length === 0) {
            return res.status(404).json({ error: 'No se encontraron asignaciones para este responsable.' });
        }

        // Devolver la lista de asignaciones en formato JSON
        return res.json(asignaciones);
    } catch (error) {
        console.error('Error al obtener asignaciones por responsable:', error);
        return res.status(500).json({ error: 'Error al obtener asignaciones por responsable.' });
    }
};
