const db = require('../../DB/mysql');
const respuesta = require('../../red/respuestas');

class PartidoControlador {

    constructor() {
        this.guardarPartido = this.guardarPartido.bind(this);
        this.obtenerHistorial = this.obtenerHistorial.bind(this);
    }

    async guardarPartido(req, res) {
        try {
            const id_usuario = req.user.id; 
            const { id_personaje, nivel, jugador_2, resultado, monedas,goles_favor, goles_contra } = req.body;

            if (id_personaje === undefined || !nivel || !jugador_2 || !resultado) {
                return respuesta.error(req, res, 'Faltan datos del partido', 400);
            }

            const datos = {
                id_usuario,
                id_personaje,
                nivel,
                jugador_2,
                resultado,
                monedas: monedas || 0,
                goles_favor: goles_favor || 0,
                goles_contra: goles_contra || 0
            };

            const resultadoDB = await db.registrarPartido(datos);

            respuesta.success(req, res, { 
                message: 'Partido registrado', 
                partido: resultadoDB 
            }, 201);

        } catch (error) {
            respuesta.error(req, res, 'Error al guardar el partido', 500, error);
        }
    }

    async obtenerHistorial(req, res) {
        try {
            const id_usuario = req.user.id;
            const historial = await db.historialPorUsuario(id_usuario);
            
            respuesta.success(req, res, historial, 200);
        } catch (error) {
            respuesta.error(req, res, 'Error obteniendo el historial', 500, error);
        }
    }
}

module.exports = new PartidoControlador();