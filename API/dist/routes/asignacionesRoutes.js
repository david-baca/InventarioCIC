// module.exports = router;
const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionesController');
const asignacionMiddlewares = require('../middlewares/asignacionesMiddlewares');
const { uploadPdf } = require('../config/uploadPdf');
const { uploadImg } = require('../config/uploadings'); // Correcto
// Endpoint para buscar asignaciones
router.get('/search/:query', asignacionController.buscarAsignaciones);
router.get('/search/', asignacionController.buscarAsignaciones);
// Endpoint para buscar articulos con asignaciones
router.get('/articulos/search/:query', asignacionController.buscarAsignacionesArticulos);
router.get('/articulos/search/', asignacionController.buscarAsignacionesArticulos);
// Endpoint para buscar responsables con asignaciones
router.get('/responsables/search/:query', asignacionController.buscarAsignacionesResponsables);
router.get('/responsables/search/', asignacionController.buscarAsignacionesResponsables);
// Dar de baja una asignación con middleware
router.patch('/:id/baja',uploadPdf.single("file"), asignacionController.darDeBajaAsignacion);
router.patch('/baja-img',uploadImg.array('imagenes', 5), asignacionController.cambiarImagenes);

// Obtener detalles de una asignación con middleware
router.get('/:id', asignacionMiddlewares.middleGetAsignacionDetails, asignacionController.obtenerDetallesAsignacion);
// Endpoint para obtener registro de asignaciones por artículo
router.get('/articulo/:fk_Articulo', asignacionController.registroAsignacionesPorArticulo);
// Endpoint para obtener registro de asignaciones por responsable
router.get('/responsable/:fk_Responsable', asignacionController.registroAsignacionesPorResponsable);
// Ruta para crear asignación y subir archivo
router.post('/crearAsignacion', uploadPdf.single("file"), asignacionController.crearAsignacion);
//rutas para sacar reportes ecxel de apartados
router.post('/articuloReport/:fk_Articulo', asignacionController.registroArticuloExcel);
router.post('/responsableReport/:fk_Reponsable', asignacionController.registroReponsableExcel);
module.exports = router;
