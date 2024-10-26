// src/routes/grupoRoutes.js
const express = require('express');
const router = express.Router();
const gruposMiddlewares = require('../middlewares/gruposMiddlewares');
const grupoController = require('../controllers/gruposController');

// Endpoint para buscar grupos
router.get('/search/:query', grupoController.buscarGrupos);

// Endpoint para crear un nuevo grupo
router.post('/', gruposMiddlewares.createGrupo, grupoController.crearGrupo);

// Endpoint para editar un grupo
router.put('/:id', gruposMiddlewares.editGrupo, grupoController.editarGrupo);

// Endpoint para dar de baja un grupo
router.delete('/:id/baja', gruposMiddlewares.bajaGrupo, grupoController.darDeBajaGrupo);

module.exports = router;
