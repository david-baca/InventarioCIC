// src/routes/areaRoutes.js
const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areasController');
const validateLength = require('../middlewares/validateLength'); 

// Endpoint para crear una nueva área
router.post('/', validateLength, areaController.crearArea);

// Endpoint para editar un área
router.put('/:id' ,validateLength, areaController.editarArea);

// Endpoint para buscar áreas
router.get('/search/:query', areaController.buscarAreas);

// Endpoint para dar de baja un área
router.patch('/:id/baja', validateLength, areaController.darDeBajaArea);

module.exports = router;
