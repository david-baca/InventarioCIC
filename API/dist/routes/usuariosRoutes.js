// src/routes/userRoutes.js
const express = require('express');
const usuariosRoutes = express.Router();
const usuariosMiddlewares = require("../middlewares/usuariosMiddlewares")
const userController = require('../controllers/usuariosController');
 
// Endpoint para crear un nuevo usuario
usuariosRoutes.post('/',usuariosMiddlewares.createUsuario, userController.crearUsuario);

// Endpoint para editar un usuario existente
usuariosRoutes.put('/:id',usuariosMiddlewares.editUsuario, userController.editarUsuario);

// Endpoint para mostrar todos los usuarios
usuariosRoutes.get('/all', userController.mostrarUsuarios);

// Endpoint para mostrar detalles de un usuario
usuariosRoutes.get('/details/:correo',/*usuariosMiddlewares.searchUsuario,*/ userController.detallesUsuario);

module.exports = usuariosRoutes;
