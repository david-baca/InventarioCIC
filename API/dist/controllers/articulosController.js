const { Articulos, Condiciones, Imagenes, Areas, Grupos, Asignaciones, Responsables } = require('../model');
const { Op } = require('sequelize');
const { saveAs } = require('file-saver');
const ExcelJS = require('exceljs');

exports.exportarArticulosExcel = async (req, res) => {
    try {
        // Obtener los artículos
        const articulos = await Articulos.findAll({
            where: { disponible: 1 },
            attributes: ['pk', 'nombre', 'no_inventario', 'descripcion', 'costo'],
        });

        // Crear un nuevo workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Artículos');

        // Agregar encabezados
        worksheet.columns = [
            { header: 'ID', key: 'pk', width: 10 },
            { header: 'Artículo', key: 'nombre', width: 30 },
            { header: 'No. Inventario', key: 'no_inventario', width: 20 },
            { header: 'Descripción', key: 'descripcion', width: 40 },
            { header: 'Costo', key: 'costo', width: 15 },
        ];

        // Insertar filas con los datos de los artículos
        articulos.forEach((articulo) => {
            worksheet.addRow({
                pk: articulo.pk,
                nombre: articulo.nombre,
                no_inventario: articulo.no_inventario,
                descripcion: articulo.descripcion,
                costo: parseFloat(articulo.costo).toFixed(2),
            });
        });

        // Estilizar la cabecera
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFCC' },
            };
        });

        // Configurar los encabezados HTTP
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=articulos_${new Date().toISOString().slice(0, 10)}.xlsx`
        );

        // Enviar el archivo como stream
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar el archivo Excel:', error);
        res.status(500).json({ error: 'No se pudo generar el archivo Excel' });
    }
};



exports.buscarArticulosAll = async (req, res) => {
    try {
        const resultado = await Articulos.findAll({
            where: { disponible: 1 },
            attributes: ['pk', 'nombre', 'no_inventario', 'descripcion', 'costo'] // Agregar 'descripcion'
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de artículos' });
    }
}; 
exports.buscarArticulos = async (req, res) => {
    const { query } = req.params;
    try {
        const resultado = await Articulos.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { no_inventario: { [Op.like]: `%${query}%` } }
                ],
                disponible: 1
            },
            attributes: ['pk', 'nombre', 'no_inventario', 'descripcion', 'costo'] // Agregar 'descripcion'
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de artículos' });
    }
}; 
exports.crearArticulo = async (req, res) => {
    try {
        const { no_inventario, nombre, descripcion, costo, consumible, grupo} = req.body;
        const nuevoArticulo = await Articulos.create({
            no_inventario:no_inventario,
            nombre:nombre,
            descripcion:descripcion,
            costo:costo,
            consumible: consumible,
            Grupos_pk: null,
            disponible: 1,
        });
        console.log(grupo)
        if(grupo>0 && grupo!==null && grupo!==""){
        await nuevoArticulo.update(
            { Grupos_pk:grupo }
        );}
        if (req.files && req.files.length > 0) {
            const nuevaCondicion = await Condiciones.create({
                Articulos_pk: nuevoArticulo.pk,
                fecha: new Date(),
                disponible: 1,
            });
            const imagenesData = req.files.map(file => {
                return {
                    imagen: file.path,
                    Condiciones_pk: nuevaCondicion.pk,
                };
            });
            await Imagenes.bulkCreate(imagenesData);
        }
        res.json({ message: 'Artículo creado exitosamente', articulo: nuevoArticulo });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el artículo' });
    }
};
exports.editarArticulo = async (req, res) => {
    const { id } = req.params;
    const { grupo, no_inventario, nombre, descripcion, costo, consumible} = req.body;
    try {
        //buscamos articulo
        articulo = await Articulos.findByPk(id)
        // Actualizar los campos del artículo
        await articulo.update(
            { no_inventario, nombre, descripcion, costo, consumible, 
            Grupos_pk:null }
        );
        if(grupo>0 && grupo!==null && grupo!==""){
            await articulo.update(
            { Grupos_pk:grupo }
        );}
        //verificamos si es necesario cambiar las condiciones
        const { pathimg } = req.body;
        if(req.files.length > 0 || pathimg !== null){
            //desactivamos las consiciones actuales del articulo
            const condicion = await Condiciones.findOne({ where: { Articulos_pk: articulo.pk, disponible: 1 } })
            if(condicion) await condicion.update({ disponible: 0 });
            //creamos una nueva condicion
            const nuevaCondicion = await Condiciones.create({
                Articulos_pk: articulo.pk,
                fecha: new Date(),
                disponible: 1,
            });
            // verificamos si es necesario agregar condiciones de files
            if (req.files && req.files.length > 0) {
                const imagenesData = req.files.map(file => ({
                    imagen: file.path,
                    Condiciones_pk: nuevaCondicion.pk,
                }));
                await Imagenes.bulkCreate(imagenesData);
            }
            if (Array.isArray(pathimg) && pathimg.length > 0) {
                // Si es un arreglo con elementos, procesamos cada imagen
                let imagenesAntiguas = [];
                for (let i = 0; i < pathimg.length; i++) {
                    imagenesAntiguas.push({
                        imagen: pathimg[i],
                        Condiciones_pk: nuevaCondicion.pk,
                    });
                }
                await Imagenes.bulkCreate(imagenesAntiguas); // Insertamos múltiples imágenes
            } else if (pathimg && typeof pathimg === 'string') {
                // Si es una cadena de texto (solo una imagen)
                await Imagenes.create({
                    imagen: pathimg,
                    Condiciones_pk: nuevaCondicion.pk,
                });
            }
        }
        //cargar condiciones viejas que se mentionene en esta nueva concidion
        return res.status(200).json({ message: 'Artículo editado con éxito' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al editar el artículo'+error });
    }
};
exports.darDeBajaArticulo = async (req, res) => {
    const { id } = req.params;
    try {
        //buscamos articulo
        articulo = await Articulos.findByPk(id)
        //verificamos si es necesario cambiar las condiciones
        const { pathimg } = req.body;
        if(req.files.length > 0 || pathimg !== null){
            //desactivamos las consiciones actuales del articulo
            const condicion = await Condiciones.findOne({ where: { Articulos_pk: articulo.pk, disponible: 1 } })
            if(condicion) await condicion.update({ disponible: 0 });
            //creamos una nueva condicion
            const nuevaCondicion = await Condiciones.create({
                Articulos_pk: articulo.pk,
                fecha: new Date(),
                disponible: 1,
            });
            // verificamos si es necesario agregar condiciones de files
            if (req.files && req.files.length > 0) {
                const imagenesData = req.files.map(file => ({
                    imagen: file.path,
                    Condiciones_pk: nuevaCondicion.pk,
                }));
                await Imagenes.bulkCreate(imagenesData);
            }
            if (Array.isArray(pathimg) && pathimg.length > 0) {
                // Si es un arreglo con elementos, procesamos cada imagen
                let imagenesAntiguas = [];
                for (let i = 0; i < pathimg.length; i++) {
                    imagenesAntiguas.push({
                        imagen: pathimg[i],
                        Condiciones_pk: nuevaCondicion.pk,
                    });
                }
                await Imagenes.bulkCreate(imagenesAntiguas); // Insertamos múltiples imágenes
            } else if (pathimg && typeof pathimg === 'string') {
                // Si es una cadena de texto (solo una imagen)
                await Imagenes.create({
                    imagen: pathimg,
                    Condiciones_pk: nuevaCondicion.pk,
                });
            }
        }
        articulo = await Articulos.update({ 
            disponible: 0,
            Grupos_pk: null,
            Area_pk: null
            }, { where: { pk:id } });
        res.json({ message: 'Artículo dado de baja exitosamente'});
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el artículo' });
    }
};
exports.detallesArticulo = async (req, res) => {
    const { no_inventario } = req.params;
    try {
        const articulo = await Articulos.findOne({
            where: { no_inventario: no_inventario },
            include: [
                {
                    where: { disponible: 1 },
                    required: false,
                    model: Condiciones,
                    as: 'Condiciones',
                    include:[{
                        model:Imagenes,
                        as: 'Imagenes',
                    }]
                },
                {
                    model: Grupos,
                    as: 'Grupo'
                },
                {
                    model: Areas,
                    as: 'Area'
                },
            ]
        });
        // Check if any articles were found
        if (articulo === null) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        const responsable = await Responsables.findOne({
            where: { disponible: 1 },
            include:{where: { Articulos_pk: articulo.pk, disponible: 1 },
                model: Asignaciones,
                as: 'Asignaciones'},
        });
        if(responsable === null) {res.json({ articulo }); return;}
        const respuesta = { ...articulo.dataValues, responsable:{...responsable.dataValues} };
        res.json({"articulo":{ ...respuesta }});
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del artículo: ' + error.message });
    }
};
exports.articulosSinGrupo = async (req, res) => {
    const { fk_execpcion, query } = req.params; // Extraemos la excepción y el query
    try {
        const whereConditions = {
            disponible: 1,
            Grupos_pk: { [Op.is]: null },
        };

        if (query && query !== null) {
            whereConditions[Op.or] = [
                { nombre: { [Op.like]: `%${query}%` } },
                { no_inventario: { [Op.like]: `%${query}%` } }
            ];
        }

        // Realizamos la consulta con las condiciones correspondientes
        const resultado = await Articulos.findAll({
            where: whereConditions
        });
        // Si fk_execpcion tiene un valor válido, excluimos los artículos de ese grupo
        if (fk_execpcion && fk_execpcion !== 'null') {
            const exeptionres = await Articulos.findAll({
                where: {
                    disponible: 1,
                    Grupos_pk: fk_execpcion,
                }
            });
            return res.json({articulos:[...resultado, ...exeptionres]});
        }
        res.json({ articulos: resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos sin grupo' });
    }
};
exports.articulosSinArea = async (req, res) => {
    const { fk_execpcion, query } = req.params; // Extraemos la excepción y el query
    try {
        const whereConditions = {
            disponible: 1,
            Area_pk: { [Op.is]: null },
        };

        if (query && query !== null) {
            whereConditions[Op.or] = [
                { nombre: { [Op.like]: `%${query}%` } },
                { no_inventario: { [Op.like]: `%${query}%` } }
            ];
        }

        // Realizamos la consulta con las condiciones correspondientes
        const resultado = await Articulos.findAll({
            where: whereConditions
        });
        // Si fk_execpcion tiene un valor válido, excluimos los artículos de ese grupo
        if (fk_execpcion && fk_execpcion !== 'null') {
            const exeptionres = await Articulos.findAll({
                where: {
                    disponible: 1,
                    Area_pk: fk_execpcion,
                }
            });
            return res.json({articulos:[...resultado, ...exeptionres]});
        }
        res.json({ articulos: resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos sin area' });
    }
};

