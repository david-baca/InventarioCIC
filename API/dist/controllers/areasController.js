// src/controllers/areaController.js
const areaView = require('../views/areasView');
const {Areas } = require ('../model');
const { Op } = require('sequelize');
let areas = []; // Simulación de base de datos en memoria
//__________________prueba de que si se actualizo el git_________________________________________________________________________________________crear (POST)
exports.crearArea = async (req, res) => {
    const { codigo, descripcion } = req.body;  
    if (!codigo || !descripcion) {
        return res.status(400).json({
            error: 'Faltan datos requeridos: codigo y descripcion son obligatorios.'
        });
    }
    const disponible = 1;  
    const nuevaArea = { codigo, descripcion, disponible };

    try {
        const area = await Areas.create(nuevaArea);   
        res.status(201).json(areaView.datosAreaCreada(area));
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
}; 


//______________________________________________________________________________________________________________editar(PUT)
exports.editarArea = async (req, res) => {
    try {
        const area = await Areas.findByPk(req.params.id);
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }
        const { codigo, descripcion } = req.body;
        if (!codigo || !descripcion) {
            return res.status(400).json({
                error: 'Faltan datos requeridos: codigo y descripcion y motivo son obligatorios.'
            });
        }  
        await area.update({ codigo, descripcion,  }); 
        res.status(200).json({
            message: 'El área ha sido actualizada con éxito.',
            area
        });
    } catch (error) {      
        res.status(400).json({ error: error.message });
    }
};
//______________________________________________________________________________________________________________buscar(GET)
exports.buscarAreas = async (req, res) => {
    try {
        const { query } = req.params; 
       const areas = await Areas.findAll({
            where: {
                [Op.or]: [
                    { codigo: query },        
                    { descripcion: { [Op.like]: `%${query}%` } }    
                ]
            }
        });
        if (areas.length > 0) {
            res.status(200).json(areaView.listaAreas(areas)); 
        } else {
            res.status(404).json({ message: 'No se encontraron áreas.' }); 
        }
    } catch (error) {   
        res.status(500).json({ error: error.message });
    }
};

//______________________________________________________________________________________________________________Dar de baja (PATCH)
exports.darDeBajaArea = async (req, res) => {
    try {     
        
        const area = await Areas.findByPk(req.params.id);    
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada' });
        }

       
        const { motivo } = req.body; 
        if (!motivo) {
            return res.status(400).json({ error: 'Es necesario especificar un motivo para dar de baja el área.' });
        }

        
        await area.update({ disponible: false, motivo });

        
        res.status(200).json({
            message: 'El área ha sido dada de baja con éxito.',
            motivo, 
            area
        });
    } catch (error) {    
        
        res.status(500).json({ error: error.message });
    }
};