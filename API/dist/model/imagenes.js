// models/imagenes.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Imagenes = sequelize.define('Imagenes', {
  imagen: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  Condiciones_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Condiciones',
      key: 'pk',
    },
  },
}, {
  tableName: 'Imagenes',
  timestamps: false,
});

module.exports = Imagenes;
