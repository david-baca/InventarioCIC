// models/usuarios.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuarios = sequelize.define('Usuarios', {
  pk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100],  // longitud minima.
    },
  },
  apellido_p: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [3, 50],  // longitud minima.
      isAlpha: true,   // solo letras.
    },
  },
  apellido_m: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [3, 50],  // longitud minima.
      isAlpha: true,   // solo letras.
    },
  },
  correo: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true,
  },
  master: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Usuarios',
  timestamps: false,
});

module.exports = Usuarios;
