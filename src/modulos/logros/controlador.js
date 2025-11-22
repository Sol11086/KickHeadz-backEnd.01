const db = require('../../DB/mysql');
const respuesta = require('../../red/respuestas');
const TABLA_USUARIO = 'Usuario';

class LogroControlador {
    
    constructor() {
        this.listar = this.listar.bind(this);
        this.misLogros = this.misLogros.bind(this);
        this.desbloquear = this.desbloquear.bind(this);
    }

    async listar(req, res) {
        try {
            const logros = await db.obtenerTodosLogros();
            respuesta.success(req, res, logros, 200);
        } catch (error) {
            respuesta.error(req, res, "Error al listar logros", 500, error);
        }
    }

    async misLogros(req, res) {
        try {
            const ids = await db.obtenerMisLogrosIds(req.user.id);
            respuesta.success(req, res, ids, 200);
        } catch (error) {
            respuesta.error(req, res, "Error al obtener mis logros", 500, error);
        }
    }

    async desbloquear(req, res) {
        try {
            const id_usuario = req.user.id;
            const { id_logro } = req.body;

            const conseguido = await db.tieneLogro(id_usuario, id_logro);
            if (conseguido) {
                return respuesta.success(req, res, { nuevo: false, message: "Ya tenías este logro" }, 200);
            }

            const logro = await db.obtenerLogroPorId(id_logro);

            await db.recompensaMonedas(TABLA_USUARIO, id_usuario, logro.recompensa);
            await db.otorgarLogro(id_usuario, id_logro);

            const usuarioActualizado = await db.obtenerUsuarioPorId(id_usuario);

            respuesta.success(req, res, {
                nuevo: true,
                logro: logro,
                usuario: usuarioActualizado,
                message: `¡Logro Desbloqueado: ${logro.nombre}!`
            }, 200);

        } catch (error) {
            respuesta.error(req, res, "Error al desbloquear logro", 500, error);
        }
    }
}

module.exports = new LogroControlador();