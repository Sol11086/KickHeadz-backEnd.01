
const { Usuario } = require('./modelos/usuario.js');

async function UsuarioList() {
  try {
    // SELECT * FROM Usuario  ->  Usuario.findAll()
    const usuarios = await Usuario.findAll({
        // Ocultamos la contraseña de la lista
        attributes: { exclude: ['contrasena'] } 
    });
    return usuarios;
  } catch (error) {
    console.error('Error en la consulta:', error);
    throw error;
  }
}

async function agregarUsuario(datosUsuario) {
    try {
        // CALL sp_agregar_usuario(?, ?, ?, ?)  ->  Usuario.create(...)
        // 'datosUsuario' debe ser un objeto: { nickname, correo, contrasena, fechaNacimiento }
        const nuevoUsuario = await Usuario.create(datosUsuario);
        return nuevoUsuario;
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        // Manejo de error de duplicado (ej. email o nickname ya existen)
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('El correo o nickname ya están registrados.');
        }
        throw error;
    }
}

async function loginUsuario(correo) {
    try {
        // CALL sp_login_usuario(?)  ->  Usuario.findOne(...)
        const usuario = await Usuario.findOne({ 
            where: { correo: correo } 
        });

        if (!usuario) {
            throw { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' };
        }
        // Devolvemos el objeto plano (dataValues)
        return usuario.dataValues;
    } catch (error) {
         console.error('Error al buscar usuario:', error);
         throw error;
    }
}


module.exports = {
  UsuarioList,
  agregarUsuario,
  loginUsuario,
};