// src/routes/areaRoutes.js
const express = require('express');
const router = express.Router();
const areaMiddlewares = require('../middlewares/areaMiddlewares');  // Middleware para Áreas
const areaController = require('../controllers/areaController');    // Controlador para Áreas

// Endpoint para buscar áreas
router.get('/', areaController.buscarAreas);                          // Buscar áreas por código o descripción
router.get('/:query', areaController.buscarAreas);                    // Buscar áreas por código o descripción

// Endpoint para obtener detalles de un área
router.get('/details/:pk', areaController.detallesArea);              // Detalles de un área específico

// Endpoint para crear un nuevo área
router.post('/', areaMiddlewares.createArea, areaController.crearArea);  // Crear área

// Endpoint para editar un área
router.put('/:id', areaMiddlewares.editArea, areaController.editarArea); // Editar área

// Endpoint para dar de baja un área
router.patch('/:id/baja', areaMiddlewares.bajaArea, areaController.darDeBajaArea);  // Dar de baja área

module.exports = router;
