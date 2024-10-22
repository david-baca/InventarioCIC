// src/routes/responsableRoutes.js
const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsablesController');

// Endpoint para crear un nuevo responsable
router.post('/', responsableController.crearResponsable);

// Endpoint para editar un responsable
router.put('/:id', responsableController.editarResponsable);

// Endpoint para buscar responsables
router.get('/search/:query', responsableController.buscarResponsables);

// Endpoint para dar de baja un responsable
router.delete('/:id/baja', responsableController.darDeBajaResponsable);

module.exports = router;
