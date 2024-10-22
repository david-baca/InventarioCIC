// src/routes/authRoutes.js
const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');
 
// Endpoint para iniciar sesión
authRoutes.post('/login', authController.iniciarSesion);

// Endpoint para cerrar sesión
authRoutes.post('/logout', authController.cerrarSesion);

module.exports = authRoutes;
