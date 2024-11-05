const { Sequelize } = require('sequelize');
require('dotenv').config();
const password = process.env.PASS_BD || '';
const user = process.env.USER_BD || 'root';
const puente = process.env.PORT_BD || 3306;

const sequelize = new Sequelize('inventarioCIC', user, password, {
    host: 'localhost',
    dialect: 'mysql',
    port: puente,
    logging: false,
});

module.exports = sequelize;