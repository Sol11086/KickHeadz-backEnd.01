
const { Usuario } = require('./modelos/usuario.js');
const { Partido } = require('./modelos/partido.js');
const { UsuarioPersonaje } = require('./modelos/usuario_personaje');
const { Personaje } = require('./modelos/personaje');

async function recompensaMonedas(tabla, id_usuario, cantidad) {
    try {
        await Usuario.increment(
            { monedas: cantidad }, 
            { where: { id_usuario: id_usuario } }
        );
    } catch (error) {
        console.error('Error al sumar monedas:', error);
        throw error;
    }
}

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

async function registrarPartido(datosPartido) {
    try {
        const nuevoPartido = await Partido.create(datosPartido);
        return nuevoPartido;
    } catch (error) {
        console.error('Error al registrar partido:', error);
        throw error;
    }
}

async function historialPorUsuario(id_usuario) {
    try {
        const historial = await Partido.findAll({
            where: { id_usuario: id_usuario },
            order: [['id_partido', 'DESC']] // Los más recientes primero
        });
        return historial;
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        throw error;
    }
}

// --- TIENDA ---

async function verificarPosesion(id_usuario, id_personaje) {
    try {
        const posesion = await UsuarioPersonaje.findOne({
            where: { id_usuario, id_personaje }
        });
        return !!posesion; // Devuelve true si existe, false si no
    } catch (error) {
        throw error;
    }
}

async function obtenerPersonaje(id_personaje) {
    try {
        return await Personaje.findByPk(id_personaje);
    } catch (error) {
        throw error;
    }
}

async function registrarCompra(id_usuario, id_personaje) {
    try {
        return await UsuarioPersonaje.create({ id_usuario, id_personaje });
    } catch (error) {
        throw error;
    }
}

// Función auxiliar para traer TODOS los IDs de personajes que tiene un usuario
async function obtenerMisPersonajes(id_usuario) {
    try {
        const registros = await UsuarioPersonaje.findAll({
            where: { id_usuario },
            attributes: ['id_personaje']
        });
        // Retorna un array simple de IDs: [1, 2, 5]
        return registros.map(r => r.id_personaje);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    recompensaMonedas,
    UsuarioList,
    obtenerUsuarioPorId,
    agregarUsuario,
    actualizarUsuario,
    loginUsuario,
    registrarPartido,
    historialPorUsuario,
    verificarPosesion,
    obtenerPersonaje,
    registrarCompra,
    obtenerMisPersonajes
};