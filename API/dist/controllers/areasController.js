// src/controllers/areaController.js
const areaView = require('../views/areasView');

let areas = []; // Simulación de base de datos en memoria

exports.crearArea = (req, res) => {
    const { codigo, descripcion } = req.body;

    const nuevaArea = { id: areas.length + 1, codigo, descripcion };
    areas.push(nuevaArea);

    res.json(areaView.datosAreaCreada(nuevaArea));
};

exports.editarArea = (req, res) => {
    const { id } = req.params;
    const { codigo, descripcion } = req.body;

    const area = areas.find(a => a.id == id);
    if (!area) {
        return res.status(404).json(areaView.errorArea('Área no encontrada'));
    }

    area.codigo = codigo;
    area.descripcion = descripcion;

    res.json(areaView.confirmacionEdicion(area));
};

exports.buscarAreas = (req, res) => {
    const { query } = req.params;
    const resultado = areas.filter(a => 
        a.codigo.includes(query) || 
        a.descripcion.includes(query)
    );

    res.json(areaView.listaAreas(resultado));
};

exports.darDeBajaArea = (req, res) => {
    const { id } = req.params;

    const index = areas.findIndex(a => a.id == id);
    if (index === -1) {
        return res.status(404).json(areaView.errorArea('Área no encontrada'));
    }

    const areaBaja = areas[index];
    areas.splice(index, 1);

    res.json(areaView.confirmacionBaja(areaBaja));
};
