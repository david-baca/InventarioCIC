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
            attributes: ['nombres', 'apellido_p', 'apellido_m', 'correo'],
            include: {
                model: Permisos,
                attributes: ['Funciones_pk'],
            }
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).json(userView.errorUsuario('Error al obtener los usuarios: ' + error));
    }
};



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
