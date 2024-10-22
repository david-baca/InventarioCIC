// models/funciones.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funciones = sequelize.define('Funciones', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'Funciones',
  timestamps: false,
});

module.exports = Funciones;
