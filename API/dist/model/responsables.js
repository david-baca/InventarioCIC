// models/responsables.js
//definir los datos para la 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Responsables = sequelize.define('Responsables', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_p: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apellido_m: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  correo:{
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'Responsables',
  timestamps: false,
});

module.exports = Responsables;
