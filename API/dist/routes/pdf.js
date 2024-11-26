// routes/pdf.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { DOCtoPDF } = require('../config/ilovepdf');

// Endpoint para convertir Word a PDF
router.post('/convert-to-pdf', async (req, res) => {
  const { docFileName } = req.body;

  if (!docFileName) {
    return res.status(400).json({ error: 'El nombre del archivo .docx es requerido.' });
  }

  const docPath = path.join(__dirname, `../uploads/${docFileName}`); // Ruta del archivo .docx
  const pdfPath = path.join(__dirname, `../uploads/${docFileName.replace('.docx', '.pdf')}`); // Ruta del archivo .pdf

  try {
    await DOCtoPDF({ pathDOC: docPath, pathSAVEpdf: pdfPath });
    res.json({ success: true, pdfPath: `/uploads/${docFileName.replace('.docx', '.pdf')}` });
  } catch (error) {
    console.error('Error al convertir el archivo:', error.message);
    res.status(500).json({ error: 'Error al convertir el archivo a PDF.' });
  }
});

module.exports = router;
