// module.exports = router;
const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsablesController');
const responsableMiddlewares = require('../middlewares/responsablesMiddlewares');

// Endpoint para crear un nuevo responsable con middleware
router.post('/', responsableMiddlewares.middleCreateResponsable, responsableController.crearResponsable);

// Endpoint para editar un responsable con middleware
router.put('/:id', responsableMiddlewares.middleEditResponsable, responsableController.editarResponsable);

// Endpoint para buscar responsables con middleware
router.get('/search/:query', responsableMiddlewares.middleSearchResponsable, responsableController.buscarResponsables);

// Endpoint para dar de baja un responsable con middleware
router.delete('/:id/baja', responsableMiddlewares.middleBajaResponsable, responsableController.darDeBajaResponsable);

module.exports = router;
