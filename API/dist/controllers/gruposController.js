const grupoView = require('../views/gruposView');
const { Grupos, Articulos, Historial } = require('../model'); // Asegúrate de tener el modelo Grupos importado
const { Op, where } = require('sequelize');
// Buscar grupos
exports.buscarGrupos = async (req, res) => {
    const { query } = req.params; // Extraemos el query
    try {
        const whereConditions = {
            disponible: 1 // Solo buscar grupos disponibles
        };
        if (query && query !== 'null' && query !== '') {
            whereConditions[Op.or] = [
                { nombre: { [Op.like]: `%${query}%` } },
                { descripcion: { [Op.like]: `%${query}%` } }
            ];
        }
        const resultado = await Grupos.findAll({
            where: whereConditions
        });
        res.json(grupoView.listaGrupos(resultado));
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda de grupos' });
    }
};
// Detalles de un grupo en espesifico
exports.detallesGrupo = async (req, res) => {
    const { pk } = req.params;
    try {
        const grupo = await Grupos.findByPk(pk)
        if(grupo=== undefined) return res.status(404).json({ error: 'Grupo no encontrado' });
        const articulos = await Articulos.findAll({
            where: { Grupos_pk: pk },
        });
        res.json({ articulos, grupo });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del artículo: ' + error.message });
    }
};
// Crear un nuevo grupo 
exports.crearGrupo = async (req, res) => {
    const { localUser,nombre, descripcion, articulos } = req.body; // Captura la lista de artículos
    try {
        const nuevoGrupo = await Grupos.create({ nombre, descripcion });

        // Actualizar los artículos con el nuevo grupo
        if (articulos && articulos.length > 0) {
            for (let i = 0; i < articulos.length; i++) {
                const x = await Articulos.findByPk(articulos[i]);  // Encuentra el artículo por su PK
                console.log(x);
                if (x) {
                    x.Grupos_pk = nuevoGrupo.pk
                    await x.save();  // Guarda los cambios
                    console.log('Artículo actualizado: ', x);
                } else {
                    console.log(`No se encontró el artículo con PK ${articulos[i]}`);
                }
            }
        }
        await Historial.create({
            descripcion: "Se creo un grupo con nombre "+nuevoGrupo.nombre,
            fecha_accion: new Date(),
            Usuarios_pk: localUser, 
            disponible: 1,
        });
        res.json(grupoView.datosGrupoCreado(nuevoGrupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
};

// Editar
exports.editarGrupo = async (req, res) => {
    console.log("entra en editar grupo");
    const { id } = req.params;
    const { nombre, descripcion, articulos, localUser, motivo } = req.body; // Captura la lista de artículos (pks)
    
    try {
        const grupo = await Grupos.findByPk(id);
        if (!grupo) {
            return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
        }
        await grupo.update({ nombre, descripcion });
        await Articulos.update(
            { Grupos_pk: null },  // Establece el campo Grupos_pk a null
            { where: { Grupos_pk: grupo.pk } }  // Solo actualizamos los artículos que están actualmente asignados a este grupo
        );
        // Ahora, asociamos los artículos seleccionados al grupo editado
        if (articulos && articulos.length > 0) {
            for (let i = 0; i < articulos.length; i++) {
                const x = await Articulos.findByPk(articulos[i]);  // Encuentra el artículo por su PK
                console.log(x);
                if (x) {
                    x.Grupos_pk = grupo.pk
                    await x.save();  // Guarda los cambios
                    console.log('Artículo actualizado: ', x);
                } else {
                    console.log(`No se encontró el artículo con PK ${articulos[i]}`);
                }
            }
        }

        console.log("Paso 3");
        // Retorna la respuesta con el grupo actualizado
        res.json(grupoView.confirmacionEdicion({message:"grupo exitosamente editado", grupo:grupo}));
        await Historial.create({
            descripcion: "Se edito un grupo con nombre"+grupo.nombre+" "+motivo,
            fecha_accion: new Date(),
            Usuarios_pk: localUser, 
            disponible: 1,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el grupo'+ error });
    }
};


// Dar de baja un grupo
exports.darDeBajaGrupo = async (req, res) => {
    const { id } = req.params;
    const { localUser, motivo } = req.body;
    try {
        const grupo = await Grupos.findByPk(id);
        if (!grupo) {
            return res.status(404).json(grupoView.errorGrupo('Grupo no encontrado'));
        }
        await grupo.update({ disponible: 0 }); // Marcar como no disponible
        await Historial.create({
            descripcion: "Se efectuo una baja de un grupo con nombre"+grupo.nombre+" "+motivo,
            fecha_accion: new Date(),
            Usuarios_pk: localUser, 
            disponible: 1,
        });
        res.json(grupoView.confirmacionBaja(grupo));
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja el grupo' });
    }
};
