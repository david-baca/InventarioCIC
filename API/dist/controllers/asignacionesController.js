// src/controllers/asignacionController.js
require('dotenv').config();
const asignacionView = require('../views/asignacionesView');
const XlsxPopulate = require('xlsx-populate');
const { Documentos, Asignaciones, Articulos, Responsables, Historial, Condiciones, Imagenes } = require('../model');
const { Op } = require('sequelize');

exports.buscarAsignaciones = async (req, res) => {
    const { query } = req.params;
    // Validar si el query está vacío
    try {
        const whereConditions = {};
        if (query && query !== null) {
            whereConditions[Op.or] = [
                { nombre: { [Op.like]: `%${query}%` } },
                { no_inventario: { [Op.like]: `%${query}%` } }
            ];
        }
        // Realizar la búsqueda en la base de datos usando Sequelize
        const resultado = await Asignaciones.findAll({
            where: whereConditions,
            include: [
                {
                    model: Articulos, // Incluir detalles del artículo
                },
                {
                    model: Responsables, // Incluir detalles del responsable
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

exports.buscarAsignacionesArticulos = async (req, res) => {
    const { query } = req.params;
    // Validar si el query está vacío
    try {
        const whereConditions = {};
        if (query && query !== null) {
            whereConditions[Op.or] = [
                { nombre: { [Op.like]: `%${query}%` } },
                { no_inventario: { [Op.like]: `%${query}%` } }
            ];
        }
        // Realizar la búsqueda en la base de datos usando Sequelize
        const resultado = await Articulos.findAll({
            where: whereConditions,
            include: [
                {
                    required: true,
                    model: Asignaciones,
                    as: 'Asignaciones',
                }
            ]
        });
        // Devolver el resultado en JSON
        return res.json(resultado);
    } catch (error) {
        // Mostrar el error en la consola para depurar
        console.error('Error al buscar asignaciones:', error);
        return res.status(500).json({ error: error.message });
    }
};

exports.buscarAsignacionesResponsables = async (req, res) => {
    const { query } = req.params;
    // Validar si el query está vacío
    try {
        const whereConditions = {};
        if (query && query !== null) {
            whereConditions[Op.or] = [
                { nombres: { [Op.like]: `%${query}%` } },
                { apellido_p: { [Op.like]: `%${query}%` } },
                { apellido_m: { [Op.like]: `%${query}%` } },
            ];
        }
        // Realizar la búsqueda en la base de datos usando Sequelize
        const resultado = await Responsables.findAll({
            where: whereConditions,
            include: [
                {
                    required: true,
                    model: Asignaciones,
                    as: 'Asignaciones',
                }
            ]
        });
        // Devolver el resultado en JSON
        return res.json(resultado);
    } catch (error) {
        // Mostrar el error en la consola para depurar
        console.error('Error al buscar asignaciones:', error);
        return res.status(500).json({ error: error.message });
    }
};
// src/controllers/asignacionesController.js
exports.crearAsignacion = async (req, res) => {    
    try {
        const { fk_Articulo, fk_Responsable, localUser } = req.body;
        // Validar si el archivo y los datos de la asignación están presentes
        if (!req.file || !fk_Articulo || !fk_Responsable) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo el archivo PDF.' });
        } 
        // Crear la asignación
        const asignacion = await Asignaciones.create({
            Articulos_pk: fk_Articulo,
            Responsables_pk: fk_Responsable,
            disponible: true,
            fecha_asignacion: new Date(),
            fecha_devolucion: null,
        });
        // Crear el registro del archivo en la tabla Documentos
        await Documentos.create({
            doc_firma: req.file.path,
            Asignaciones_pk: asignacion.pk,
            disponible: true,
        });
        await Historial.create({
            descripcion: "Se realizo una asignacion con el documento nombrado "+req.file.path,
            fecha_accion: new Date(),
            Usuarios_pk: localUser, 
            disponible: 1,
        });
        // Responder con el mensaje de éxito y los datos de la asignación
        res.status(201).json({ message: 'Asignación creada exitosamente.', asignacion });
    } catch (error) {
        console.error("Error al crear la asignación:", error);
        res.status(500).json({ error: 'Error al crear la asignación.', error });
    }
};
// Dar de baja una asignación por ID
exports.darDeBajaAsignacion = async (req, res) => {
    try {
        const { id } = req.params; 
        const { motivo, localUser } = req.body; 
        const historialRegistro = await Historial.create({
            descripcion: 'Asignación dada de baja '+motivo || 'Asignación dada de baja',
            fecha_accion: new Date(),
            Usuarios_pk: localUser, 
            disponible: 1,
        });
        const asignacion = await Asignaciones.findOne({
            where: { pk: id }
        });
        if (!asignacion) {
            return res.status(404).json({ error: 'Asignación no encontrada.' });
        }
        await Documentos.create({
            doc_firma: req.file.path,
            Asignaciones_pk: asignacion.pk,
            disponible: false,
        });
        await asignacion.update({ fecha_devolucion: new Date(), disponible:false });
        return res.json({
            message: 'Asignación dada de baja exitosamente y registrada en el historial.',
            historial: historialRegistro
        });
    } catch (error) {
        console.error('Error al dar de baja la asignación:', error);
        return res.status(500).json({ error: 'Error al dar de baja la asignación.' });
    }
};
exports.cambiarImagenes = async (req, res) => {
    try {
        const { id } = req.body;
        const articulo = await Articulos.findByPk(id)
        //desactivamos las consiciones actuales del articulo
        const condicion = await Condiciones.findOne({ where: { Articulos_pk: articulo.pk, disponible: 1 } })
        if(condicion) await condicion.update({ disponible: 0 });
        const nuevaCondicion = await Condiciones.create({
            Articulos_pk: articulo.pk,
            fecha: new Date(),
            disponible: 1,
        });
        if (req.files && req.files.length > 0) {
            const imagenesData = req.files.map(file => ({
                imagen: file.path,
                Condiciones_pk: nuevaCondicion.pk,
            }));
            await Imagenes.bulkCreate(imagenesData);
        }
        return res.status(200).json({ message: 'Artículo editado con éxito' });
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
                    as: 'Articulo'
                },
                {
                    model: Responsables, // Incluir los detalles del responsable
                    as: 'Responsable',
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos'
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
        return res.status(500).json({ error: 'Error al obtener asignaciones por artículo.' });
    }
};
exports.registroArticuloExcel = async (req, res) => {
    try {
        const { fk_Articulo } = req.params;
        // Validar que el artículo está presente
        if (!fk_Articulo) return res.status(400).json({ error: 'El artículo es inválido o no se proporcionó.' });
        // Buscar asignaciones relacionadas con el artículo en la base de datos
        const asignaciones = await Asignaciones.findAll({
            where: { Articulos_pk: fk_Articulo }, // Filtrar por el número del artículo
            include: [
                {
                    model: Articulos, // Incluir los detalles del artículo
                    as: 'Articulo'
                },
                {
                    model: Responsables, // Incluir los detalles del responsable
                    as: 'Responsable',
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos'
                }
            ],
        });
        // Si no se encuentran asignaciones para ese artículo
        if (!asignaciones || asignaciones.length === 0) return res.status(404).json({ error: 'No se encontraron asignaciones para este artículo.' });
        // Crear un nuevo archivo de Excel con xlsx-populate
        // Formatear datos para el Excel
    
        // Formatear datos para el Excel
        let formattedData = [];
        const baseApi = process.env.BASE_API
        asignaciones.forEach((asignacion) => {
            const documentoAsignacion = asignacion.Documentos[0] ? baseApi+asignacion.Documentos[0].doc_firma : "sin documento";
            const documentoRecepcion = asignacion.Documentos[1] ? baseApi+asignacion.Documentos[1].doc_firma : "sin documento";
            const fechaAsignacion = asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toLocaleTimeString('es-ES', {
                day: '2-digit',   // Día con 2 dígitos
                month: '2-digit', // Mes con 2 dígitos
                year: 'numeric',
                hour: '2-digit',  // Hora con 2 dígitos
                minute: '2-digit',// Minutos con 2 dígitos
                hour12: false,    // Formato de 24 horas
              }): "sin asignar";              ;
            const fechaDevolucion = asignacion.fecha_devolucion? new Date(asignacion.fecha_devolucion).toLocaleTimeString('es-ES', {
                day: '2-digit',   // Día con 2 dígitos
                month: '2-digit', // Mes con 2 dígitos
                year: 'numeric',
                hour: '2-digit',  // Hora con 2 dígitos
                minute: '2-digit',// Minutos con 2 dígitos
                hour12: false,    // Formato de 24 horas
              }): "sin asignar";  
            formattedData.push({
                'Fecha de Asignación': fechaAsignacion,
                'Fecha de Devolución': fechaDevolucion,
                'Nombre del Responsable': `${asignacion.Responsable.nombres} ${asignacion.Responsable.apellido_p} ${asignacion.Responsable.apellido_m}`,
                'Correo Responsable': asignacion.Responsable.correo,
                'Documento de Asignación': documentoAsignacion,
                'Documento de Recepción': documentoRecepcion
            });
        });

        console.log(formattedData);

        const generateExcel = async () => {
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheetGeneral = workbook.addSheet('General');
            //eliminar la hoja por defecto 
            workbook.deleteSheet('Sheet1');
            // Agregar encabezados
            const headersGeneral = [
                'Fecha de Asignación',
                'Fecha de Devolución',
                'Nombre del Responsable',
                'Correo Responsable',
                'Documento de Asignación',
                'Documento de Recepción',
            ];
            headersGeneral.forEach((header, index) => {
                sheetGeneral.cell(1, index + 1).value(header);
            });
            // Agregar datos
            formattedData.forEach((item, rowIndex) => {
                Object.keys(item).forEach((key, colIndex) => {
                    sheetGeneral.cell(rowIndex + 2, colIndex + 1).value(item[key]);
                });
            });
            // Ajustar el ancho de las columnas
            const columnWidths = [20, 20, 28, 30, 100, 100];
            columnWidths.forEach((width, index) => {
                sheetGeneral.column(index + 1).width(width);
            });
            // Convertir el libro en un buffer
            const buffer = await workbook.outputAsync();
            // Configurar la respuesta para descarga de archivo
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
            // Enviar el buffer como respuesta
            res.end(buffer);
        }

        // Generar y enviar el archivo
        generateExcel();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar el archivo Excel');
    }
};
exports.registroReponsableExcel = async (req, res) => {
    try {
        const { fk_Reponsable } = req.params;
        // Validar que el artículo está presente
        if (!fk_Reponsable) return res.status(400).json({ error: 'El responsable es inválido o no se proporcionó.' });
        // Buscar asignaciones relacionadas con el artículo en la base de datos
        const asignaciones = await Asignaciones.findAll({
            where: { Responsables_pk: fk_Reponsable }, // Filtrar por el número del artículo
            include: [
                {
                    model: Articulos, // Incluir los detalles del artículo
                    as: 'Articulo'
                },
                {
                    model: Responsables, // Incluir los detalles del responsable
                    as: 'Responsable',
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos',
                }
            ],
        });
        // Si no se encuentran asignaciones para ese artículo
        if (!asignaciones || asignaciones.length === 0) return res.status(404).json({ error: 'No se encontraron asignaciones para este artículo.' });
        // Crear un nuevo archivo de Excel con xlsx-populate
        // Formatear datos para el Excel
    
        // Formatear datos para el Excel
        let formattedData = [];
        const baseApi = process.env.BASE_API
        asignaciones.forEach((asignacion) => {
            const documentoAsignacion = asignacion.Documentos[0] ? baseApi+asignacion.Documentos[0].doc_firma : "sin documento";
            const documentoRecepcion = asignacion.Documentos[1] ? baseApi+asignacion.Documentos[1].doc_firma : "sin documento";
            const fechaAsignacion = asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toLocaleTimeString('es-ES', {
                day: '2-digit',   // Día con 2 dígitos
                month: '2-digit', // Mes con 2 dígitos
                year: 'numeric',
                hour: '2-digit',  // Hora con 2 dígitos
                minute: '2-digit',// Minutos con 2 dígitos
                hour12: false,    // Formato de 24 horas
              }): "sin asignar";              ;
            const fechaDevolucion = asignacion.fecha_devolucion? new Date(asignacion.fecha_devolucion).toLocaleTimeString('es-ES', {
                day: '2-digit',   // Día con 2 dígitos
                month: '2-digit', // Mes con 2 dígitos
                year: 'numeric',
                hour: '2-digit',  // Hora con 2 dígitos
                minute: '2-digit',// Minutos con 2 dígitos
                hour12: false,    // Formato de 24 horas
              }): "sin asignar";  
            formattedData.push({
                'Fecha de Asignación': fechaAsignacion,
                'Fecha de Devolución': fechaDevolucion,
                'Nombre del Responsable': `${asignacion.Responsable.nombres} ${asignacion.Responsable.apellido_p} ${asignacion.Responsable.apellido_m}`,
                'Correo Responsable': asignacion.Responsable.correo,
                'Documento de Asignación': documentoAsignacion,
                'Documento de Recepción': documentoRecepcion
            });
        });

        console.log(formattedData);

        const generateExcel = async () => {
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheetGeneral = workbook.addSheet('General');
            //eliminar la hoja por defecto 
            workbook.deleteSheet('Sheet1');
            // Agregar encabezados
            const headersGeneral = [
                'Fecha de Asignación',
                'Fecha de Devolución',
                'Nombre del Responsable',
                'Correo Responsable',
                'Documento de Asignación',
                'Documento de Recepción',
            ];
            headersGeneral.forEach((header, index) => {
                sheetGeneral.cell(1, index + 1).value(header);
            });
            // Agregar datos
            formattedData.forEach((item, rowIndex) => {
                Object.keys(item).forEach((key, colIndex) => {
                    sheetGeneral.cell(rowIndex + 2, colIndex + 1).value(item[key]);
                });
            });
            // Ajustar el ancho de las columnas
            const columnWidths = [20, 20, 28, 30, 100, 100];
            columnWidths.forEach((width, index) => {
                sheetGeneral.column(index + 1).width(width);
            });
            // Convertir el libro en un buffer
            const buffer = await workbook.outputAsync();
            // Configurar la respuesta para descarga de archivo
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
            // Enviar el buffer como respuesta
            res.end(buffer);
        }

        // Generar y enviar el archivo
        generateExcel();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar el archivo Excel');
    }
};
// Registro de asignaciones por Responsable
exports.registroAsignacionesPorResponsable = async (req, res) => {
    const { fk_Responsable } = req.params;
    try {
        // Buscar asignaciones relacionadas con el responsable en la base de datos
        const asignaciones = await Asignaciones.findAll({
            where: { Responsables_pk: fk_Responsable }, // Filtrar por el ID del responsable
            include: [
                {
                    model: Articulos, // Incluir los detalles del artículo
                    as: 'Articulo',
                },
                {
                    model: Responsables, // Incluir los detalles del responsable
                    as: 'Responsable',
                },
                {
                    model: Documentos, // Incluir los documentos relacionados
                    as: 'Documentos',
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
