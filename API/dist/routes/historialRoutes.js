// src/routes/grupoRoutes.js
const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historialController');

// Endpoint para buscar grupos
router.get('/search/', historicoController.buscarHistoricos);
router.get('/search/:query', historicoController.buscarHistoricos);

module.exports = router;
