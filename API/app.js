const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./dist/routes/authRoutes'); 
const usuariosRoutes = require('./dist/routes/usuariosRoutes'); 
const articulosRoutes = require('./dist/routes/articulosRoutes');
const responsablesRoutes = require('./dist/routes/responsablesRoutes');
const gruposRoutes = require('./dist/routes/gruposRoutes');
const areasRoutes = require('./dist/routes/areasRoutes');
const asignacionesRoutes = require('./dist/routes/asignacionesRoutes');
const historialRoutes = require('./dist/routes/historialRoutes');
const sequelize = require('./dist/config/database');
const app = express();
const port_front = process.env.ORIGIN_PORT_FRONT || 3720;
// Configuración básica de CORS para permitir todas las solicitudes
app.use(cors({
    origin: `*`, // Permitir solicitudes solo desde este dominio
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos en las solicitudes
  }));
// Middleware
app.use(bodyParser.json()); 

// Rutas
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/articulos', articulosRoutes);
app.use('/responsables', responsablesRoutes);
app.use('/grupos', gruposRoutes);
app.use('/areas', areasRoutes);
app.use('/asignaciones', asignacionesRoutes);
app.use('/historico', historialRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Sincronización y creación de la base de datos si no existe  
sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch(async (error) => {
        console.error("Error al sincronizar la base de datos:\n"+
        "Porfavor asegurese de que su gestor de base de datos este correndo o que exista la base de datos inventario_cic ");
        process.exit(1);
    });

//const initializeApp = require('./config/initialize'); inicializador de creacion de base de datos
//initializeApp() elemento aun no funcional

module.exports = app;
