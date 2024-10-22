// src/controllers/responsableController.js
const responsableView = require('../views/responsablesView');

let responsables = []; // Simulación de base de datos en memoria

exports.crearResponsable = (req, res) => {
    const { nombres, apellido_p, apellido_m, cargo, disponible } = req.body;

    const nuevoResponsable = { id: responsables.length + 1, nombres, apellido_p, apellido_m, cargo, disponible };
    responsables.push(nuevoResponsable);

    res.json(responsableView.datosResponsableCreado(nuevoResponsable));
};

exports.editarResponsable = (req, res) => {
    const { id } = req.params;
    const { nombres, apellido_p, apellido_m, cargo } = req.body;

    const responsable = responsables.find(r => r.id == id);
    if (!responsable) {
        return res.status(404).json(responsableView.errorResponsable('Responsable no encontrado'));
    }

    responsable.nombres = nombres;
    responsable.apellido_p = apellido_p;
    responsable.apellido_m = apellido_m;
    responsable.cargo = cargo;

    res.json(responsableView.confirmacionEdicion(responsable));
};

exports.buscarResponsables = (req, res) => {
    const { query } = req.params;
    const resultado = responsables.filter(r => 
        r.nombres.includes(query) || 
        r.apellido_p.includes(query) || 
        r.apellido_m.includes(query)
    );

    res.json(responsableView.listaResponsables(resultado));
};

exports.darDeBajaResponsable = (req, res) => {
    const { id } = req.params;
    const { motivo } = req.body;

    const index = responsables.findIndex(r => r.id == id);
    if (index === -1) {
        return res.status(404).json(responsableView.errorResponsable('Responsable no encontrado'));
    }

    const responsableBaja = responsables[index];
    responsables.splice(index, 1);

    res.json(responsableView.confirmacionBaja(responsableBaja));
};
