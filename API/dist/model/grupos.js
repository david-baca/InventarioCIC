// models/grupos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grupos = sequelize.define('Grupos', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Grupos',
  timestamps: false,
});

module.exports = Grupos;
