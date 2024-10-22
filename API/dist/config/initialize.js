const mysql = require('mysql2/promise');
const sequelize = require('./database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const password = process.env.PASS_BD || '';
const user = process.env.USER_BD || 'root';
const puente = process.env.PORT_BD || 3306;

// Función para crear la base de datos si no existe
async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        port: puente
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS inventarioCIC;`);
        console.log('Base de datos inventarioCIC verificada/creada');
    } catch (error) {
        console.error('Error al crear la base de datos:', error);
    } finally {
        await connection.end();
    }
}

// Función para inicializar la aplicación
async function initializeApp() {
    try {
        await createDatabaseIfNotExists();

        // Sincronización y creación de la base de datos si no existe
        await sequelize.sync({ force: false });
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);

        // Si hay un error, intentar ejecutar el script create.sql para crear la base de datos
        const createScriptPath = path.join(__dirname, '../siupqroo.sql');
        try {
            if (fs.existsSync(createScriptPath)) {
                const createScript = fs.readFileSync(createScriptPath, 'latin1');
                const queries = createScript.split(';').filter(query => query.trim() !== '');

                for (const query of queries) {
                    await sequelize.query(query);
                }
                console.log('Base de datos creada utilizando el script create.sql');
            } else {
                console.error('No se encontró el script create.sql en el directorio actual.');
            }
        } catch (error) {
            console.error('Error al ejecutar el script create.sql:', error);
        }
    }
}

module.exports = initializeApp;
