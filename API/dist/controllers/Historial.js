// Controlador para manejar las acciones del historial
const express = require('express');
const router = express.Router();
const { Historia } = require('../models');  // Modelo de Historia para guardar las acciones

// Endpoint para registrar una nueva acción
router.post('/api/articulos', async (req, res) => {
  const { usuario, accion, descripcion, tipoAccion } = req.body;

  // Guardar en el historial
  try {
    await Historia.create({
      usuario,
      accion,
      descripcion,
      tipoAccion,
      fecha: new Date(),
    });

    // Guardar el artículo, por ejemplo
    const newArticulo = await Articulo.create(req.body);
    res.status(201).json(newArticulo);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el artículo.' });
  }
});

// Endpoint para obtener el historial
router.get('/api/historial', async (req, res) => {
  try {
    const historial = await Historia.findAll();
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial.' });
  }
});

module.exports = router;
