// models/documentos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Documentos = sequelize.define('Documentos', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doc_firma: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Asignaciones_pk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Asignaciones',
      key: 'pk',
    },
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Documentos',
  timestamps: false,
});

module.exports = Documentos;
