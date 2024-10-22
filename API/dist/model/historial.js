// models/historial.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historial = sequelize.define('Historial', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fecha_accion: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Usuarios_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Usuarios',
      key: 'pk',
    },
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Historial',
  timestamps: false,
});

module.exports = Historial;
