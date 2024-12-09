// module.exports = router;
const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionesController');
const asignacionMiddlewares = require('../middlewares/asignacionesMiddlewares');
const { uploadPdf } = require('../config/uploadPdf');
const { uploadImg } = require('../config/uploadings'); // Correcto
// Endpoint para buscar asignaciones
router.get('/search/:query', asignacionController.buscarAsignaciones);
router.get('/search/', asignacionController.buscarAsignaciones);
// Crear una nueva asignación con middleware
// router.post('/crearAsignacion', asignacionMiddlewares.middleCreateAsignacion, asignacionController.crearAsignacion);
// router.post('/crearAsignacion', asignacionController.crearAsignacion);
// Subir documento firmado para la asignación
// router.post('/subirDocumento', asignacionController.subirDocumentoAsignacion);
// Dar de baja una asignación con middleware
router.patch('/:id/baja',uploadPdf.single("file"), asignacionController.darDeBajaAsignacion);
router.patch('/baja-img',uploadImg.array('imagenes', 5), asignacionController.cambiarImagenes);
// Obtener detalles de una asignación con middleware
router.get('/:id', asignacionMiddlewares.middleGetAsignacionDetails, asignacionController.obtenerDetallesAsignacion);
// Endpoint para obtener registro de asignaciones por artículo
router.get('/articulo/:fk_Articulo', asignacionController.registroAsignacionesPorArticulo);
// Endpoint para obtener registro de asignaciones por responsable
router.get('/responsable/:fk_Responsable', asignacionController.registroAsignacionesPorResponsable);
// Ruta para crear asignación y subir archivo
router.post('/crearAsignacion', uploadPdf.single("file"), asignacionController.crearAsignacion);
router.post('/articuloReport/:fk_Articulo', asignacionController.registroArticuloExcel);
module.exports = router;
