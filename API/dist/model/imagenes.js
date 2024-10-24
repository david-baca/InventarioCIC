// models/imagenes.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Imagenes = sequelize.define('Imagenes', {
  imagen: {
    type: DataTypes.STRING(250),
    allowNull: false,
    primaryKey: true,  // Parte de la clave primaria compuesta
  },
  Condiciones_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Condiciones',
      key: 'pk',
    },
    primaryKey: true,  // Parte de la clave primaria compuesta
  },
}, {
  tableName: 'Imagenes',
  timestamps: false,
});

module.exports = Imagenes;
