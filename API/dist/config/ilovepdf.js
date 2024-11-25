const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const fs = require('node:fs');

// Instancia de la API con las claves
const instance = new ILovePDFApi(
  'project_public_18d8cf2f66627f182b1bf856b53bde47_VZbOJ03448e676545ea468e11bb7a0ff7da12',
  'secret_key_1ba96fb96e639eee8adcf65a5f526cfc_ecls_28105654ae3cb2ad616afb817f15b129'
);

// Función para convertir DOC a PDF
const DOCtoPDF = async ({ pathDOC, pathSAVEpdf }) => {
  try {
    console.log('Iniciando conversión de DOC a PDF...');
    const task = instance.newTask('officepdf'); // Nueva tarea de conversión
    await task.start(); // Inicia la tarea
    console.log('Tarea iniciada...');

    const file = new ILovePDFFile(pathDOC); // Carga el archivo DOC
    await task.addFile(file); // Agrega el archivo a la tarea
    console.log(`Archivo agregado: ${pathDOC}`);

    await task.process(); // Procesa la conversión
    console.log('Archivo procesado...');

    const data = await task.download(); // Descarga el PDF convertido
    fs.writeFileSync(pathSAVEpdf, data); // Guarda el PDF en el sistema
    console.log(`Archivo PDF generado: ${pathSAVEpdf}`);
  } catch (error) {
    console.error('Error durante la conversión:', error.message);
  }
};

module.exports = { DOCtoPDF }; // Exporta la función para usarla en otros módulos
