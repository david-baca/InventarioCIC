// src/routes/asignacionRoutes.js
const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionesController');

// Endpoint para buscar asignaciones
router.get('/search/:query', asignacionController.buscarAsignaciones);

// Endpoint para crear una nueva asignación
router.post('/', asignacionController.crearAsignacion);

// Endpoint para dar de baja una asignación
router.patch('/:id/baja', asignacionController.darDeBajaAsignacion);

// Endpoint para obtener detalles de una asignación
router.get('/:id', asignacionController.obtenerDetallesAsignacion);

// Endpoint para obtener registro de asignaciones por artículo
router.get('/articulo/:fk_Articulo', asignacionController.registroAsignacionesPorArticulo);

// Endpoint para obtener registro de asignaciones por responsable
router.get('/responsable/:fk_Responsable', asignacionController.registroAsignacionesPorResponsable);

module.exports = router;
