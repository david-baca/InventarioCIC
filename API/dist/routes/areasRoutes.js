// src/routes/areaRoutes.js
const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areasController');

// Endpoint para crear una nueva área
router.post('/', areaController.crearArea);

// Endpoint para editar un área
router.put('/:id', areaController.editarArea);

// Endpoint para buscar áreas
router.get('/search/:query', areaController.buscarAreas);

// Endpoint para dar de baja un área
router.delete('/:id/baja', areaController.darDeBajaArea);

module.exports = router;
