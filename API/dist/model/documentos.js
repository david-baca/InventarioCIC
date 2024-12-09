// models/documentos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Asignaciones = require('./asignaciones'); // Asegúrate de importar Asignaciones correctamente

// Definir el modelo Documentos
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

// Relacion de documentos y asignacion
Documentos.belongsTo(Asignaciones, { foreignKey: 'Asignaciones_pk', as: 'asignacion' });

module.exports = Documentos;
