// src/config/uploadings.js
const multer = require('multer');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para la imagen
    },
});

const uploadImg = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Máximo 2MB por imagen
});

module.exports = { uploadImg }; // Asegúrate de exportar correctamente el middleware
