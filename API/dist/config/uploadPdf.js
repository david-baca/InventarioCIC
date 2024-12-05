const multer = require('multer');
const path = require('path');

// Configuración para guardar los archivos PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Guardar los archivos en la carpeta 'uploads/documents'
        cb(null, 'uploads/documents');
    },
    filename: (req, file, cb) => {
        // Nombrar el archivo con la fecha actual + nombre original del archivo
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Configuración de las restricciones para los archivos PDF
const uploadPdf = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // Limite de tamaño
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.pdf') {
        cb(null, true); 
      } else {
        cb(new Error('Solo se permiten archivos PDF.'));
      }
    },
  });

// Middleware que maneja el archivo PDF y los demás datos (artículo y responsable)
const uploadAssignment = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 },
}).fields([
    { name: 'file', maxCount: 1 }, // Campo para el archivo
    { name: 'fk_Articulo', maxCount: 1 }, // Campo para el ID del artículo
    { name: 'fk_Responsable', maxCount: 1 }, // Campo para el ID del responsable
]);

module.exports = { uploadPdf, uploadAssignment };
