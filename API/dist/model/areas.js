// models/areas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Areas = sequelize.define('Areas', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING(45),
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
  tableName: 'Areas',
  timestamps: false,
});

module.exports = Areas;
