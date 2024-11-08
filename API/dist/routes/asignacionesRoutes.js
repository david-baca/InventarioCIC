// module.exports = router;
const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionesController');
const asignacionMiddlewares = require('../middlewares/asignacionesMiddlewares');

// Endpoint para buscar asignaciones
router.get('/search/:query', asignacionController.buscarAsignaciones);

// Crear una nueva asignación con middleware
// router.post('/crearAsignacion', asignacionMiddlewares.middleCreateAsignacion, asignacionController.crearAsignacion);
router.post('/crearAsignacion', asignacionController.crearAsignacion);
// Subir documento firmado para la asignación
router.post('/subirDocumento', asignacionController.subirDocumentoAsignacion);

// Dar de baja una asignación con middleware
router.patch('/:id/baja', asignacionController.darDeBajaAsignacion);

// Obtener detalles de una asignación con middleware
router.get('/:id', asignacionMiddlewares.middleGetAsignacionDetails, asignacionController.obtenerDetallesAsignacion);

// Endpoint para obtener registro de asignaciones por artículo
router.get('/articulo/:fk_Articulo', asignacionController.registroAsignacionesPorArticulo);

// Endpoint para obtener registro de asignaciones por responsable
router.get('/responsable/:fk_Responsable', asignacionController.registroAsignacionesPorResponsable);

module.exports = router;
