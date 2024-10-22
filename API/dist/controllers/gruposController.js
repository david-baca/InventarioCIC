// src/controllers/grupoController.js
const grupoView = require('../views/gruposView');

let grupos = []; // Simulación de base de datos en memoria

exports.buscarGrupos = (req, res) => {
    const { query } = req.params;
    const resultado = grupos.filter(g => 
        g.nombre.includes(query) || 
        g.descripcion.includes(query)
    );

    res.json(grupoView.listaGrupos(resultado));
};

exports.crearGrupo = (req, res) => {
    const { nombre, descripcion } = req.body;

    const nuevoGrupo = { id: grupos.length + 1, nombre, descripcion };
    grupos.push(nuevoGrupo);

    res.json(grupoView.datosGrupoCreado(nuevoGrupo));
};

exports.editarGrupo = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const grupo = grupos.find(g => g.id == id);
    if (!grupo) {
        return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
    }

    grupo.nombre = nombre;
    grupo.descripcion = descripcion;

    res.json(grupoView.confirmacionEdicion(grupo));
};

exports.darDeBajaGrupo = (req, res) => {
    const { id } = req.params;
    const { motivo } = req.body;

    const index = grupos.findIndex(g => g.id == id);
    if (index === -1) {
        return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
    }

    const grupoBaja = grupos[index];
    grupos.splice(index, 1);

    res.json(grupoView.confirmacionBaja(grupoBaja));
};
