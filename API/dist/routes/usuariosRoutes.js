// src/routes/userRoutes.js
const express = require('express');
const usuariosRoutes = express.Router();
const userController = require('../controllers/usuariosController');
 
// Endpoint para crear un nuevo usuario
usuariosRoutes.post('/', userController.crearUsuario);

// Endpoint para editar un usuario existente
usuariosRoutes.put('/:id', userController.editarUsuario);

// Endpoint para mostrar todos los usuarios
usuariosRoutes.get('/all', userController.mostrarUsuarios);

// Endpoint para mostrar detalles de un usuario
usuariosRoutes.get('/details/:correo', userController.detallesUsuario);

module.exports = usuariosRoutes;
