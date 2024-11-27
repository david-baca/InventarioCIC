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
        let usuario = await Usuarios.update(
            {disponible:disponible},
            {where:{pk:id}  }
        );
        // Actualizar permisos si se proporcionan
        if (permisos !== undefined) {
            if (!Array.isArray(permisos)) {
            return res.status(400).json({
                error: "El campo `permisos` no es valido.",
            });
            }
    
            // Eliminar permisos existentes del usuario
            await Permisos.destroy({
                where: { Usuarios_pk: id },
            });
    
            // Crear nuevos permisos si el arreglo no está vacío
            if (permisos.length > 0) {
            for(let i=0;i<permisos.length > 0;i++){
                await Permisos.create({
                    Usuarios_pk:id,
                    Funciones_pk:permisos[i]
                
                })
            }
            }
        }
  
        res.json(userView.confirmacionEdicion(usuario));
    }catch (error)
    {
        console.error("Error al editar el usuario:", error);
        res.status(500).json(userView.errorUsuario('Error al editar el usuario'+ error));
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




exports.detallesUsuario = async(req, res) => {
    const {correo} = req.params
    const { disponible } = req.query;

    try {
        const condiciones = { correo };
        if (disponible !== undefined) {
            if (![0, 1].includes(parseInt(disponible))) {
                return res.status(400).json({
                error: "La disponivilidad no esta definida.",
            });
        }
        condiciones.disponible = parseInt(disponible);
        }
        
        const usuario = await Usuarios.findOne({
            where: condiciones,
          });
      
          if (!usuario) {
            return res.status(404).json({
              error: "Usuario no encontrado.",
            });
          }
        
        const permisos = await Permisos.findAll({
            where:{Usuarios_pk: usuario.pk}
        })

        res.json({usuario, permisos});
    } catch (error) {
        res.status(500).json(userView.errorUsuario('Error al obtener los usuarios: ' + error));
    }
    
};
