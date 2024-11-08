// src/config/uploadingsPdf.js
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para archivos PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documents'); // Carpeta donde se guardarán los archivos PDF
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para el archivo
    },
});

// Configuración de multer para archivos PDF con tamaño máximo de 15 MB
const uploadPdf = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // Máximo 15MB por archivo
    fileFilter: (req, file, cb) => {
        // Validación para permitir solo archivos PDF
        const fileType = path.extname(file.originalname).toLowerCase();
        if (fileType === '.pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF.'));
        }
    },
});

module.exports = { uploadPdf };
