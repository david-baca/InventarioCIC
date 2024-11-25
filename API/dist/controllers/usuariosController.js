const userView = require('../views/usuariosView');
const {Usuarios,Funciones,Permisos} = require('../model/index')


exports.crearUsuario = async (req, res) => 
{
    try{
        const { nombre, apellido_p, apellido_m, correo, permisos} = req.body; //removi (rol) pero puede que los ocupe

        const nuevoUsuario = await Usuarios.create(
        { 
            nombres: nombre, 
            apellido_p: apellido_p, 
            apellido_m: apellido_m, 
            correo: correo,
            master: 0,
            disponible: 1
        });
    console.log(permisos)
        for (const permiso of permisos) {
            console.log(permiso)
            
            await Permisos.create({
                Usuarios_pk: nuevoUsuario.pk,
                Funciones_pk: permiso,
            });
        }           

        res.json(userView.confirmacionCreacion(nuevoUsuario));
        
    } catch (error) 
    {
        res.status(500).json(userView.errorUsuario('A fallado ' + error));
    }
    
};


exports.editarUsuario = async(req, res) => 
{
    const { id } = req.params;
    const { disponible, permisos } = req.body;

    try{
        const usuario = await Usuarios.findByPk(id);
        if (!usuario)
        {
            return res.status(404).json(usuarioView.errorUsuario('Usuario no encontrado'));
        }
            
            usuario.disponible = disponible !== undefined ? disponible : usuario.disponible;
            await usuario.save();

            await Permisos.destroy({
                where: { Usuarios_pk: id }
            });

            for (const permiso of permisos) {
                await Permisos.create({
                    Usuarios_pk: id,
                    Funciones_pk: permiso
                });
            }

        res.json(userView.confirmacionActualizacion(usuario));
    }catch (error)
    {
        res.status(500).json(usuarioView.errorUsuario('Error al editar el responsable'+ error));
    }
};



exports.mostrarUsuarios = async(req, res) => {

    try {
        const usuarios = await Usuarios.findAll({
            attributes: ['pk', 'nombres', 'apellido_p', 'apellido_m', 'correo'],
            include: {
                model: Permisos,
                as: "Permisos",
                attributes: ['Funciones_pk'],
            }
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
    const {correo} = req.params

    try {
        const usuario = await Usuarios.findOne({
            where:{correo: correo}
        });
        const permisos = await Permisos.findAll({
            where:{Usuarios_pk: usuario.pk}
        })

        res.json({usuario, permisos});
    } catch (error) {
        res.status(500).json(userView.errorUsuario('Error al obtener los usuarios: ' + error));
    }
    
};

// exports.verificarCorreo = async (req, res) => {
//     try {
//       const { correo } = req.params;
  
//       const usuario = await Usuarios.findOne({
//         where: { correo },
//         attributes: ["pk", "nombres", "apellido_p", "apellido_m", "correo"],
//       });
  
//       if (!usuario) {
//         return res.status(404).json({ error: "Correo no encontrado" });
//       }
  
//       res.json(usuario);
//     } catch (error) {
//       res.status(500).json({ error: "Error al verificar el correo: " + error });
//     }
//   };