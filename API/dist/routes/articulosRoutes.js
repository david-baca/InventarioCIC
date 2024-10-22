// src/routes/articleRoutes.js
const express = require('express');
const articulosRoutes = express.Router();
const articleController = require('../controllers/articulosController');

// Endpoint para buscar artículos
articulosRoutes.get('/search/:{query}', articleController.buscarArticulos);

// Endpoint para crear un nuevo artículo
articulosRoutes.post('/', articleController.crearArticulo);

// Endpoint para editar un artículo
articulosRoutes.put('/:id', articleController.editarArticulo);

// Endpoint para dar de baja un artículo
articulosRoutes.patch('/:id/baja', articleController.darDeBajaArticulo);

// Endpoint para obtener detalles de un artículo
articulosRoutes.get('/details/:no_inventario', articleController.detallesArticulo);

// Endpoint para obtener artículos sin grupo
articulosRoutes.get('/sin/grupo/:fk_Grupo_execpcion', articleController.articulosSinGrupo);

// Endpoint para obtener artículos sin área
articulosRoutes.get('/sin/area/:fk_Area_execpcion', articleController.articulosSinArea);

module.exports = articulosRoutes;
