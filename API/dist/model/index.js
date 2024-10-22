// index.js
const sequelize = require('./config/database');
const Responsables = require('./responsables');
const Areas = require('./areas');
const Grupos = require('./grupos');
const Articulos = require('./articulos');
const Condiciones = require('./condiciones');
const Imagenes = require('./imagenes');
const Asignaciones = require('./asignaciones');
const Documentos = require('./documentos');
const Funciones = require('./funciones');
const Usuarios = require('./usuarios');
const Permisos = require('./permisos');
const Historial = require('./historial');

// Definir asociaciones

// Responsables -> Asignaciones
Responsables.hasMany(Asignaciones, {
  foreignKey: 'Responsables_pk',
  sourceKey: 'pk',
  as: 'Asignaciones'
});

Asignaciones.belongsTo(Responsables, {
  foreignKey: 'Responsables_pk',
  targetKey: 'pk',
  as: 'Responsable'
});

// Areas -> Articulos
Areas.hasMany(Articulos, {
  foreignKey: 'Area_pk',
  sourceKey: 'pk',
  as: 'Articulos'
});

Articulos.belongsTo(Areas, {
  foreignKey: 'Area_pk',
  targetKey: 'pk',
  as: 'Area'
});

// Grupos -> Articulos
Grupos.hasMany(Articulos, {
  foreignKey: 'Grupos_pk',
  sourceKey: 'pk',
  as: 'Articulos'
});

Articulos.belongsTo(Grupos, {
  foreignKey: 'Grupos_pk',
  targetKey: 'pk',
  as: 'Grupo'
});

// Articulos -> Condiciones
Articulos.hasMany(Condiciones, {
  foreignKey: 'Articulos_pk',
  sourceKey: 'pk',
  as: 'Condiciones'
});

Condiciones.belongsTo(Articulos, {
  foreignKey: 'Articulos_pk',
  targetKey: 'pk',
  as: 'Articulo'
});

// Condiciones -> Imagenes
Condiciones.hasMany(Imagenes, {
  foreignKey: 'Condiciones_pk',
  sourceKey: 'pk',
  as: 'Imagenes'
});

Imagenes.belongsTo(Condiciones, {
  foreignKey: 'Condiciones_pk',
  targetKey: 'pk',
  as: 'Condicion'
});

// Asignaciones -> Documentos
Asignaciones.hasMany(Documentos, {
  foreignKey: 'Asignaciones_pk',
  sourceKey: 'pk',
  as: 'Documentos'
});

Documentos.belongsTo(Asignaciones, {
  foreignKey: 'Asignaciones_pk',
  targetKey: 'pk',
  as: 'Asignacion'
});

// Usuarios -> Permisos
Usuarios.hasMany(Permisos, {
  foreignKey: 'Usuarios_pk',
  sourceKey: 'pk',
  as: 'Permisos'
});

Permisos.belongsTo(Usuarios, {
  foreignKey: 'Usuarios_pk',
  targetKey: 'pk',
  as: 'Usuario'
});

// Funciones -> Permisos
Funciones.hasMany(Permisos, {
  foreignKey: 'Funciones_pk',
  sourceKey: 'pk',
  as: 'Permisos'
});

Permisos.belongsTo(Funciones, {
  foreignKey: 'Funciones_pk',
  targetKey: 'pk',
  as: 'Funcion'
});

// Usuarios -> Historial
Usuarios.hasMany(Historial, {
  foreignKey: 'Usuarios_pk',
  sourceKey: 'pk',
  as: 'Historial'
});

Historial.belongsTo(Usuarios, {
  foreignKey: 'Usuarios_pk',
  targetKey: 'pk',
  as: 'Usuario'
});

module.exports = {
  sequelize,
  Responsables,
  Areas,
  Grupos,
  Articulos,
  Condiciones,
  Imagenes,
  Asignaciones,
  Documentos,
  Funciones,
  Usuarios,
  Permisos,
  Historial,
};
