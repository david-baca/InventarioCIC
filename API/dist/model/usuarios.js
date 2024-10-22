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
  },
  apellido_p: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apellido_m: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(250),
    allowNull: false,
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
