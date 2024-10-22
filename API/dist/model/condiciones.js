// models/condiciones.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Condiciones = sequelize.define('Condiciones', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Articulos_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Articulos',
      key: 'pk',
    },
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Condiciones',
  timestamps: false,
});

module.exports = Condiciones;
