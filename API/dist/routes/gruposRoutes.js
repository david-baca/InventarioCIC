// src/routes/grupoRoutes.js
const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/gruposController');

// Endpoint para buscar grupos
router.get('/search/:query', grupoController.buscarGrupos);

// Endpoint para crear un nuevo grupo
router.post('/', grupoController.crearGrupo);

// Endpoint para editar un grupo
router.put('/:id', grupoController.editarGrupo);

// Endpoint para dar de baja un grupo
router.delete('/:id/baja', grupoController.darDeBajaGrupo);

module.exports = router;
