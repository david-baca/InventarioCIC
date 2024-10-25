// src/controllers/userController.js
const userView = require('../views/usuariosView');
 
let usuarios = []; // Simulación de base de datos en memoria

exports.crearUsuario = async (req, res) => 
{
    try{
        const { nombre, apellido_p, apellido_m, correo} = req.body; //removi (rol, permisos) pero puede que los ocupe

        const nuevoUsuario = await usuarios.create(
        { 
            id: usuarios.length + 1,
            nombres, 
            apellido_p, 
            apellido_m, 
            correo
        });
    
        /*const nuevoUsuario = { id: usuarios.length + 1, nombre, correo, rol, estado: true, permisos };
        usuarios.push(nuevoUsuario);*/

        res.json(userView.confirmacionCreacion(nuevoUsuario));
        
    } catch (error) 
    {
        res.status(500).json(responsableView.errorResponsable('Error al crear el responsable'));
    }
    
};


exports.editarUsuario = async(req, res) => 
{
    try{

        const { id } = req.params;
        const { nombre, apellido_p, apellido_m, correo } = req.body;
    
        const usuario = await usuarios.findByPk(id);
        if (!usuario) 
        {
            return res.status(404).json(usuarioView.errorUsuario('Usuario no encontrado'));
        }
    
        usuario.nombre = nombre;
        usuario.apellido_p = apellido_p;
        usuario.apellido_m = apellido_m;
        usuario.rol = rol;        
        usuario.correo = correo;

        /*const usuario = usuarios.find(u => u.id == id);
        if (!usuario) {
            return res.status(404).json(userView.errorUsuario('Usuario no encontrado'));
        }*/
    
            await responsable.update(
            { 
                nombres, 
                apellido_p, 
                apellido_m, 
                cargo 
            });

        res.json(userView.confirmacionEdicion(usuario));

    }catch (error) 
    {
        res.status(500).json(responsableView.errorResponsable('Error al editar el responsable'));
    }
};


exports.mostrarUsuarios = async(req, res) => {

    try {
        const usuarios = await Usuarios.findAll();
        res.json(userView.listaUsuarios(usuarios));
    } catch (error) {
        res.status(500).json(userView.errorUsuario('Error al consultar usuario'));
    }

    //res.json(userView.listaUsuarios(usuarios));
};


exports.detallesUsuario = async(req, res) => {

    try{
    const { correo } = req.params;
    //const usuario = usuarios.find(u => u.correo === correo);
    const usuario = await Usuarios.findOne({ where: { correo } });

    if (!usuario) {
        return res.status(404).json(userView.errorUsuario('Usuario no encontrado'));
    }

    res.json(userView.detallesUsuario(usuario));

    }catch (error){
        res.status(500).json(userView.errorUsuario('Error al obtener los detalles del usuario'));
    }
    
};
