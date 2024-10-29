// // src/routes/articleRoutes.js
const express = require('express');
const articulosRoutes = express.Router();
const articulosMiddlewares = require('../middlewares/articulosMiddlewares.js');
const articleController = require('../controllers/articulosController');
const { uploadImg } = require('../config/uploadings');

// Endpoint para buscar artículos
articulosRoutes.get('/search/:query', articleController.buscarArticulos);

// Endpoint para crear un nuevo artículo con middleware
articulosRoutes.post('/', uploadImg.array('imagenes', 5), articulosMiddlewares.createArticle, articleController.crearArticulo);

// Endpoint para editar un artículo con middleware
articulosRoutes.put('/:id', articulosMiddlewares.editArticle, articleController.editarArticulo);

// Endpoint para dar de baja un artículo con middleware
articulosRoutes.patch('/:id/baja', articulosMiddlewares.bajaArticle, articleController.darDeBajaArticulo);

// Endpoint para obtener detalles de un artículo
articulosRoutes.get('/details/:no_inventario', articulosMiddlewares.detallesArticulo, articleController.detallesArticulo);

// Endpoint para obtener artículos sin grupo
articulosRoutes.get('/sin/grupo/:fk_Grupo_execpcion', articulosMiddlewares.articulosSinGrupo, articleController.articulosSinGrupo);

// Endpoint para obtener artículos sin área
articulosRoutes.get('/sin/area/:fk_Area_execpcion', articulosMiddlewares.articulosSinArea, articleController.articulosSinArea);

module.exports = articulosRoutes;
