// module.exports = router;
const express = require('express');
const router = express.Router();
const responsablesMiddlewares = require('../middlewares/responsablesMiddlewares');
const responsableController = require('../controllers/responsablesController');
const responsableMiddlewares = require('../middlewares/responsablesMiddlewares');

// Endpoint para crear un nuevo responsable
router.post('/',responsablesMiddlewares.crearResponsable, responsableController.crearResponsable);

// Endpoint para editar un responsable
router.put('/:id',responsablesMiddlewares.editarResponsable, responsableController.editarResponsable);

// Endpoint para buscar todos los artículos
router.get('/search/', responsableController.buscarResponsablesAll);
// Endpoint para buscar responsables con middleware
router.get('/search/:query', responsableController.buscarResponsables);

// Endpoint para buscar todos los artículos
router.get('/details/:pk', responsableController.buscarResponsable);
// Endpoint para dar de baja un responsable
router.patch('/baja/:id',responsablesMiddlewares.darDeBajaResponsable, responsableController.darDeBajaResponsable);

module.exports = router;
