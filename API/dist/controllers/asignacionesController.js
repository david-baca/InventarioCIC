// src/controllers/asignacionController.js
const asignacionView = require('../views/asignacionesView');
const { Documentos, Asignaciones, Articulos, Responsables, Historial } = require('../model');
const { PDFDocument } = require('pdf-lib');
const { uploadPdf } = require('../config/uploadPdf');
const fs = require('fs');
const path = require('path');
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

// Función para crear una asignación y generar el PDF
exports.crearAsignacion = async (req, res) => {
    const { fk_Articulo, fk_Responsable, urlDoc } = req.body;

    if (!fk_Articulo || !fk_Responsable || !urlDoc) {
        return res.status(400).json({ error: 'Todos los campos (fk_Articulo, fk_Responsable, urlDoc) son obligatorios.' });
    }

    try {
        const nuevaAsignacion = await Asignaciones.create({
            Articulos_pk: fk_Articulo,
            Responsables_pk: fk_Responsable,
            disponible: true,
            fecha_recibido: new Date()
        });

        const responsable = await Responsables.findByPk(fk_Responsable, {
            attributes: ['nombres', 'apellido_p', 'apellido_m']
        });
        const articulo = await Articulos.findByPk(fk_Articulo, {
            attributes: ['no_inventario', 'nombre', 'descripcion', 'costo']
        });

        const templatePath = path.resolve(__dirname, 'FORMATO DE ASIGNACION - MODULO DE REPORTES.pdf');
        const pdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Agregar texto en posiciones específicas en el PDF
        firstPage.drawText(`${responsable.nombres} ${responsable.apellido_p} ${responsable.apellido_m}`, { x: 150, y: 620, size: 12 });
        firstPage.drawText(urlDoc, { x: 350, y: 600, size: 12 });
        firstPage.drawText(articulo.no_inventario, { x: 150, y: 580, size: 12 });
        firstPage.drawText(articulo.nombre, { x: 150, y: 560, size: 12 });
        firstPage.drawText(articulo.descripcion, { x: 150, y: 540, size: 12 });
        firstPage.drawText(`$${articulo.costo}`, { x: 150, y: 520, size: 12 });

        const fecha = new Date();
        const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-MX', opcionesFecha);
        firstPage.drawText(`Cancún, Quintana Roo, a ${fechaFormateada}`, { x: 150, y: 500, size: 12 });

        // Ruta y creación de carpeta si no existe
        const pdfOutputDir = path.join(__dirname, '../uploads/documents');
        if (!fs.existsSync(pdfOutputDir)) {
            fs.mkdirSync(pdfOutputDir, { recursive: true });
        }
        
        const pdfOutputPath = path.join(pdfOutputDir, `Asignacion_${nuevaAsignacion.pk}.pdf`);
        fs.writeFileSync(pdfOutputPath, await pdfDoc.save());

        return res.status(201).json({
            message: 'Asignación creada exitosamente.',
            pdfUrl: `/uploads/documents/Asignacion_${nuevaAsignacion.pk}.pdf`
        });
    } catch (error) {
        console.error('Error al crear la asignación:', error);
        return res.status(500).json({ error: `Error al crear la asignación: ${error.message}` });
    }
};

// Función para subir el documento firmado usando Multer
exports.subirDocumentoAsignacion = (req, res) => {
    uploadPdf.single('documento')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error al subir el documento PDF. Asegúrate de que el archivo sea un PDF y no exceda los 15 MB.' });
        }

        try {
            const { idAsignacion } = req.body;
            const archivo = req.file;

            // Guardar el documento subido en la base de datos
            await Documentos.create({
                doc_firma: archivo.filename,
                fecha: new Date(),
                Asignaciones_pk: idAsignacion
            });

            return res.status(200).json({
                message: 'Documento subido exitosamente.',
                archivo: archivo.filename
            });
        } catch (error) {
            console.error('Error al guardar el documento en la base de datos:', error);
            return res.status(500).json({ error: 'Error al guardar el documento en la base de datos.' });
        }
    });
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
