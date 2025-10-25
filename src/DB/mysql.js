
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

async function obtenerUsuarioPorId(id_usuario) {
    try {
        // CALL sp_obtener_usuario_por_id(?)  ->  Usuario.findOne(...)
        const usuario = await Usuario.findOne({
            where: { id_usuario: id_usuario }
        });

        if (!usuario) {
            throw { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' };
        }
        // Devolvemos el objeto plano (dataValues)
        return usuario.dataValues;
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
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

async function actualizarUsuario(id_usuario, nuevosDatos) {
    try {
        // CALL sp_actualizar_usuario(?, ?, ?, ?)  ->  Usuario.update(...)
        await Usuario.update(nuevosDatos, {
            where: { id_usuario: id_usuario }
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
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
    obtenerUsuarioPorId,
    agregarUsuario,
    actualizarUsuario,
    loginUsuario,
};