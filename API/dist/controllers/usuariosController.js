// src/controllers/userController.js
const userView = require('../views/usuariosView');
 
let usuarios = []; // Simulación de base de datos en memoria

exports.crearUsuario = (req, res) => {
    const { nombre, correo, rol, permisos } = req.body;
    
    const nuevoUsuario = { id: usuarios.length + 1, nombre, correo, rol, estado: true, permisos };
    usuarios.push(nuevoUsuario);

    res.json(userView.confirmacionCreacion(nuevoUsuario));
};

exports.editarUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, estado, permisos } = req.body;

    const usuario = usuarios.find(u => u.id == id);
    if (!usuario) {
        return res.status(404).json(userView.errorUsuario('Usuario no encontrado'));
    }

    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.rol = rol;
    usuario.estado = estado;
    usuario.permisos = permisos;

    res.json(userView.confirmacionEdicion(usuario));
};

exports.mostrarUsuarios = (req, res) => {
    res.json(userView.listaUsuarios(usuarios));
};

exports.detallesUsuario = (req, res) => {
    const { correo } = req.params;
    const usuario = usuarios.find(u => u.correo === correo);

    if (!usuario) {
        return res.status(404).json(userView.errorUsuario('Usuario no encontrado'));
    }

    res.json(userView.detallesUsuario(usuario));
};
