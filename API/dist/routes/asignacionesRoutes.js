// module.exports = router;
const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionesController');
const asignacionMiddlewares = require('../middlewares/asignacionesMiddlewares');

// Endpoint para buscar asignaciones
router.get('/search/:query', asignacionController.buscarAsignaciones);

// Crear una nueva asignación con middleware
router.post('/', asignacionMiddlewares.middleCreateAsignacion, asignacionController.crearAsignacion);

// Dar de baja una asignación con middleware
// router.patch('/:id/baja', asignacionMiddlewares.middleBajaAsignacion, asignacionController.darDeBajaAsignacion); Error
router.patch('/:id/baja', asignacionController.darDeBajaAsignacion);

// Obtener detalles de una asignación con middleware
router.get('/:id', asignacionMiddlewares.middleGetAsignacionDetails, asignacionController.obtenerDetallesAsignacion);

// Endpoint para obtener registro de asignaciones por artículo
router.get('/articulo/:fk_Articulo', asignacionController.registroAsignacionesPorArticulo);

// Endpoint para obtener registro de asignaciones por responsable
router.get('/responsable/:fk_Responsable', asignacionController.registroAsignacionesPorResponsable);

module.exports = router;
