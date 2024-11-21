const { Articulos } = require("../model");
const { Op } = require('sequelize');

// Middleware para validar los datos de creación de un nuevo área
exports.createArea = async (req, res, next) => {
    try {
        const { nombre, descripcion, articulos } = req.body;
        let errores = [];
        
        if (!nombre) errores.push('Es necesario definir el (nombre) del área.');
        else if (nombre.length > 50) errores.push('El (nombre) del área no debe exceder los 50 caracteres.');
        
        if (!descripcion) errores.push('Es necesario definir la (descripcion) del área.');
        else if (descripcion.length > 250) errores.push('La (descripcion) del área no debe exceder los 250 caracteres.');
        
        if (articulos && articulos.length > 0) {
            let articulosAsociados = []; // Usamos un arreglo para almacenar los artículos asociados
        
            // Iteramos sobre los artículos para verificar si ya están asociados a otro área
            for (let i = 0; i < articulos.length; i++) {
                const articulo = await Articulos.findAll({
                    where: {
                        pk: articulos[i].pk,
                        Areas_pk: { [Op.ne]: null }  // Verifica que no esté asociado a ningún área
                    }
                });
        
                // Si se encuentran artículos asociados, los agregamos al arreglo
                if (articulo && articulo.length > 0) {
                    articulosAsociados.push(articulo[0]);  // Suponiendo que 'articulo' es un arreglo
                }
            }
        
            // Si encontramos artículos ya asociados, agregamos el mensaje de error
            if (articulosAsociados.length > 0) {
                errores.push('Algunos artículos ya están asociados a otro área.');
            }
        }
        
        if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación del área: ' + error });
    }
    next();
};

exports.editArea = async (req, res, next) => {
    try {
        const { nombre, descripcion, articulos } = req.body;
        const { id } = req.params;
        let errores = [];
        
        if (!nombre) errores.push('Es necesario definir el (nombre) del área.');
        else if (nombre.length > 50) errores.push('El (nombre) del área no debe exceder los 50 caracteres.');
        
        if (!descripcion) errores.push('Es necesario definir la (descripcion) del área.');
        else if (descripcion.length > 250) errores.push('La (descripcion) del área no debe exceder los 250 caracteres.');
        
        if (articulos && articulos.length > 0) {
            const idsArticulos = articulos.map(articulo => articulo.pk);
            const articulosAsociados = await Articulos.findAll({
                where: {
                    pk: idsArticulos,
                    Areas_pk: { [Op.ne]: null },
                    // Excluir el área actual de la búsqueda
                    [Op.and]: [{ pk: { [Op.ne]: id } }]
                }
            });
            if (articulosAsociados.length > 0) {
                errores.push('Algunos artículos ya están asociados a otro área.');
            }
        }

        if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la edición del área: ' + error });
    }
    next();
};

exports.bajaArea = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        let errores = [];
        
        const asociado = await Articulos.findAll({ where: { Areas_pk: id } });
        if (asociado.length > 0) errores.push('Asegúrese que ningún artículo esté asociado a esta área.');
        
        if (!motivo) errores.push('Es necesario definir el (motivo) para dar de baja el área.');
        else if (motivo.length > 250) errores.push('El (motivo) no debe exceder los 250 caracteres.');
        
        if (errores.length > 0) return res.status(400).json({ error: errores.join(' ') });
    } catch (error) {
        return res.status(500).json({ error: 'Error en la validación de la baja del área: ' + error });
    }
    next();
};