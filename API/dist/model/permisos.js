// models/permisos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permisos = sequelize.define('Permisos', {
  Usuarios_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Usuarios',
      key: 'pk',
    },
  },
  Funciones_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Funciones',
      key: 'pk',
    },
  },
}, {
  tableName: 'Permisos',
  timestamps: false,
});

module.exports = Permisos;
