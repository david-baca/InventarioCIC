// models/articulos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Articulos = sequelize.define('Articulos', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  no_inventario: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  consumible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Grupos_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Grupos',
      key: 'pk',
    },
    allowNull: true, // Puede ser nulo
  },
  Area_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Areas',
      key: 'pk',
    },
    allowNull: true, // Puede ser nulo
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Articulos',
  timestamps: false,
});

module.exports = Articulos;
