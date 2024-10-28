// src/routes/articleRoutes.js
const express = require('express');
const articulosRoutes = express.Router();
const articulosMiddlewares = require('../middlewares/articulosMiddlewares.js');
const articleController = require('../controllers/articulosController');
const { uploadImg } = require('../config/uploadings'); // Correcto
 
// Endpoint para buscar artículos
articulosRoutes.get('/search/:query', articleController.buscarArticulos);

// Endpoint para crear un nuevo artículo con imágenes opcionales
articulosRoutes.post('/', uploadImg.array('imagenes', 5), articulosMiddlewares.createArticle, articleController.crearArticulo); // Máximo 5 imágenes

// Endpoint para editar un artículo
articulosRoutes.put('/:id', uploadImg.array('imagenes', 5), articulosMiddlewares.editArticle,  articleController.editarArticulo);

// Endpoint para dar de baja un artículo
articulosRoutes.patch('/:id/baja', articulosMiddlewares.bajaArticle, articleController.darDeBajaArticulo);

// Endpoint para obtener detalles de un artículo
articulosRoutes.get('/details/:no_inventario', articleController.detallesArticulo);

// Endpoint para obtener artículos sin grupo
articulosRoutes.get('/sin/grupo/:fk_Grupo_execpcion', articleController.articulosSinGrupo);

// Endpoint para obtener artículos sin área
articulosRoutes.get('/sin/area/:fk_Area_execpcion', articleController.articulosSinArea);

module.exports = articulosRoutes;
