// src/routes/authRoutes.js
const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');
 
// Endpoint para iniciar sesión
authRoutes.post('/login', authController.iniciarSesion);

// Endpoint para cerrar sesión
authRoutes.post('/logout', authController.cerrarSesion);

module.exports = authRoutes;






const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const instance = new ILovePDFApi('project_public_18d8cf2f66627f182b1bf856b53bde47_VZbOJ03448e676545ea468e11bb7a0ff7da12', 'secret_key_1ba96fb96e639eee8adcf65a5f526cfc_ecls_28105654ae3cb2ad616afb817f15b129');
const task = instance.newTask('merge');
//const task = instance.newTask('officepdf');
task.start()
.then(() => {
    return task.addFile('./1.docx');
})
.then(() => {
    return task.process();
})
.then(() => {
    return task.download();
})
.then((data) => {
    console.log('DONE') 
    // writeFileSync('./IloveDocuments.pdf', data);
});






