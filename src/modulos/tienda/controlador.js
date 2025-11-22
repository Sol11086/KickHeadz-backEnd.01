const db = require('../../DB/mysql');
const respuesta = require('../../red/respuestas');
const TABLA = 'usuario';

class TiendaControlador {
    
    constructor() {
        this.comprar = this.comprar.bind(this);
        this.misPersonajes = this.misPersonajes.bind(this);
    }

    async comprar(req, res) {
        try {
            const id_usuario = req.user.id;
            const { id_personaje } = req.body;

            if (!id_personaje) throw new Error("Faltan datos.");

            // 1. Verificar si ya lo tiene
            const yaLoTiene = await db.verificarPosesion(id_usuario, id_personaje);
            if (yaLoTiene) return respuesta.error(req, res, "Ya posees este personaje", 400);

            // 2. Obtener precio del personaje
            const personaje = await db.obtenerPersonaje(id_personaje);
            if (!personaje) return respuesta.error(req, res, "Personaje no existe", 404);

            const usuario = await db.obtenerUsuarioPorId(id_usuario);
            if (usuario.monedas < personaje.precio) {
                return respuesta.error(req, res, "Fondos insuficientes", 400);
            }
            // Realizar compra:
            await db.recompensaMonedas(TABLA, id_usuario, -personaje.precio);
            
            // B) Registrar propiedad
            await db.registrarCompra(id_usuario, id_personaje);

            // 5. Devolver saldo actualizado
            const usuarioActualizado = await db.obtenerUsuarioPorId(id_usuario)

            respuesta.success(req, res, {
                message: `¡${personaje.nombre} adquirido!`,
                usuario: usuarioActualizado
            }, 200);

        } catch (error) {
            respuesta.error(req, res, "Error en la compra", 500, error);
        }
    }

    async misPersonajes(req, res) {
        try {
            const id_usuario = req.user.id;
            const ids = await db.obtenerMisPersonajes(id_usuario);

            const defaultChar = [1]; 
            const total = [...new Set([defaultChar, ...ids])];
            
            respuesta.success(req, res, total, 200);
        } catch (error) {
            respuesta.error(req, res, "Error al obtener personajes", 500, error);
        }
    }
}

module.exports = new TiendaControlador();