// src/routes/areaRoutes.js
const express = require('express');
const areasRoutes = express.Router();
const areaMiddlewares = require('../middlewares/areasMiddlewares');  // Middleware para Áreas
const areaController = require('../controllers/areasController');    // Controlador para Áreas

// Endpoint para buscar áreas
areasRoutes.get('/', areaController.buscarAreas);                          // Buscar áreas por código o descripción
areasRoutes.get('/:query', areaController.buscarAreas);                    // Buscar áreas por código o descripción

// Endpoint para obtener detalles de un área
areasRoutes.get('/details/:pk', areaController.detallesArea);              // Detalles de un área específico

// Endpoint para crear un nuevo área
areasRoutes.post('/', areaMiddlewares.createArea, areaController.crearArea);  // Crear área

// Endpoint para editar un área
areasRoutes.put('/:id', areaMiddlewares.editArea, areaController.editarArea); // Editar área

// Endpoint para dar de baja un área
areasRoutes.patch('/:id/baja', areaMiddlewares.bajaArea, areaController.darDeBajaArea);  // Dar de baja área

module.exports = areasRoutes;
