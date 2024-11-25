// src/controllers/userController.js
const userView = require('../views/usuariosView');
const {Usuarios,Funciones,Permisos} = require('../model/')


exports.crearUsuario = async (req, res) => 
{
    try{
        const { nombre, apellidoP, apellidoM, correo, permisos} = req.body; //removi (rol) pero puede que los ocupe

        const nuevoUsuario = await Usuarios.create(
        { 
            nombres: nombre, 
            apellido_p: apellidoP, 
            apellido_m: apellidoM, 
            correo: correo,
            master: 0,
            disponible: 1
        });
    
        for (const permiso of permisos) {
            await Permisos.create({
                Usuarios_pk: nuevoUsuario.pk,
                Funciones_pk: permiso.pk,
            });
        }           

        res.json(userView.confirmacionCreacion(nuevoUsuario));
        
    } catch (error) 
    {
        res.status(500).json(userView.errorUsuario('Error al crear el usuario ' + error));
    }
    
};


exports.editarUsuario = async(req, res) => 
{
    try{

        const { pk } = req.params;
        const { permisos } = req.body;
    
        const usuario = await usuarios.findByPk(pk);
        if (!usuario) 
        {
            return res.status(404).json(usuarioView.errorUsuario('Usuario no encontrado'));
        }
    
        await Permisos.destroy({ where: { Usuarios_pk: pk } }); // Elimina los permisos actuales del usuario

        // Añade los nuevos permisos
        for (const permiso of permisos) {
            await Permisos.create({
                Usuarios_pk: pk,
                Funciones_pk: permiso.pk,
            });
        }

        res.json(userView.confirmacionActualizacion(`Permisos actualizados para el usuario con pk: ${pk}`))
    }catch (error) 
    {
        res.status(500).json(responsableView.errorResponsable('Error al editar el responsable'));
    }
};



exports.mostrarUsuarios = async(req, res) => {

    try {
        const usuarios = await Usuarios.findAll({
            attributes: ['nombres', 'apellido_p', 'apellido_m', 'correo']
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).json(userView.errorUsuario('Error al obtener los usuarios: ' + error));
    }
};



// src/controllers/usuariosController.js
// const { Usuarios } = require('../model');
// const sequelize = require('../config/database'); // Importa la instancia de Sequelize para usar funciones de SQL

// exports.mostrarUsuarios = async (req, res) => {
//     try {
//         const usuarios = await Usuarios.findAll({
//             attributes: [
//                 'correo',
//                 [sequelize.fn('CONCAT', sequelize.col('nombres'), ' ', sequelize.col('apellido_p'), ' ', sequelize.col('apellido_m')), 'nombre_completo']
//             ]
//         });

//         res.json(usuarios);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener los usuarios: ' + error });
//     }
// };



exports.detallesUsuario = async(req, res) => {

    try {
        const usuarios = await Usuarios.findAll({
            attributes: ['correo']
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).json(userView.errorUsuario('Error al obtener los usuarios: ' + error));
    }
    
};
