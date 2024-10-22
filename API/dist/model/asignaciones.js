// models/asignaciones.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asignaciones = sequelize.define('Asignaciones', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha_recibido: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Responsables_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Responsables',
      key: 'pk',
    },
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
  tableName: 'Asignaciones',
  timestamps: false,
});

module.exports = Asignaciones;
