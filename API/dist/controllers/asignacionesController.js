// src/controllers/asignacionController.js
const asignacionView = require('../views/asignacionesView');

let asignaciones = []; // Simulación de base de datos en memoria

exports.buscarAsignaciones = (req, res) => {
    const { query } = req.params;
    const resultado = asignaciones.filter(a => 
        a.fk_Articulo.toString().includes(query) || 
        a.fk_Responsable.toString().includes(query) || 
        a.urlDoc.includes(query)
    );

    res.json(asignacionView.listaAsignaciones(resultado));
};

exports.crearAsignacion = (req, res) => {
    const { fk_Articulo, fk_Responsable, urlDoc } = req.body;

    const nuevaAsignacion = { 
        id: asignaciones.length + 1, 
        fk_Articulo, 
        fk_Responsable, 
        urlDoc 
    };
    asignaciones.push(nuevaAsignacion);

    res.json(asignacionView.datosAsignacionCreada(nuevaAsignacion));
};

exports.darDeBajaAsignacion = (req, res) => {
    const { id } = req.params;
    const index = asignaciones.findIndex(a => a.id == id);
    
    if (index === -1) {
        return res.status(404).json(asignacionView.errorAsignacion('Asignación no encontrada'));
    }

    const asignacionBaja = asignaciones[index];
    asignaciones.splice(index, 1);

    res.json(asignacionView.confirmacionBaja(asignacionBaja));
};

exports.obtenerDetallesAsignacion = (req, res) => {
    const { id } = req.params;
    const asignacion = asignaciones.find(a => a.id == id);

    if (!asignacion) {
        return res.status(404).json(asignacionView.errorAsignacion('Asignación no encontrada'));
    }

    res.json(asignacionView.detallesAsignacion(asignacion));
};

exports.registroAsignacionesPorArticulo = (req, res) => {
    const { fk_Articulo } = req.params;
    const resultado = asignaciones.filter(a => a.fk_Articulo == fk_Articulo);

    res.json(asignacionView.listaAsignaciones(resultado));
};

exports.registroAsignacionesPorResponsable = (req, res) => {
    const { fk_Responsable } = req.params;
    const resultado = asignaciones.filter(a => a.fk_Responsable == fk_Responsable);

    res.json(asignacionView.listaAsignaciones(resultado));
};
