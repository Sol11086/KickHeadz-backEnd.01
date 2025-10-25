const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const respuesta = require('../../red/respuestas');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const SALT_ROUNDS = 10;
const USUARIO = 'Usuario';

class UsuarioControlador {

    constructor() {
        // Asignación de métodos para mantener el contexto 'this'
        this.UsuarioList = this.UsuarioList.bind(this);
        this.registrarUsuario = this.registrarUsuario.bind(this);
        this.actualizarUsuario = this.actualizarUsuario.bind(this);
        this.login = this.login.bind(this);
    }

    _validarContrasena(contrasena) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(contrasena);
    }

    async UsuarioList(req, res) {
        try {
            const result = await db.UsuarioList(USUARIO);
            respuesta.success(req, res, result, 200);
        } catch (error) {
            respuesta.error(req, res, 'Error obteniendo usuarios', 500, error);
        }
    }

    async registrarUsuario(req, res) {
        const { nickname, correo, contrasena, fechaNacimiento } = req.body;

        if (!nickname || !correo || !contrasena || !fechaNacimiento) {
            return respuesta.error(req, res, 'Faltan datos', 400);
        }

        try {

            if (!this._validarContrasena(contrasena)) {
                throw new Error('La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.');
            }

            const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

            await db.agregarUsuario({
                nickname: nickname,
                correo: correo,
                contrasena: hash,
                fechaNacimiento: fechaNacimiento
            });

            respuesta.success(req, res, 'Usuario registrado correctamente', 201);

        } catch (error) {
            console.error('Error completo:', error);
            respuesta.error(req, res, error.message || 'Error registrando usuario', 500, error);
        }
    }

    async actualizarUsuario(req, res) {
        const { id_usuario, nickname, correo, contrasena, fechaNacimiento, monedas } = req.body;

        if (!id_usuario || !nickname || !correo || !contrasena || !fechaNacimiento || monedas === undefined) {
            return respuesta.error(req, res, 'Faltan datos', 400);
        }

        try {

            if (!this._validarContrasena(contrasena)) {
                throw new Error('La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.');
            }

            const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
            await db.actualizarUsuario(id_usuario, {
                nickname: nickname,
                correo: correo,
                contrasena: hash,
                monedas: monedas,
                fechaNacimiento: fechaNacimiento,
            });

            const usuarioActualizado = await db.obtenerUsuarioPorId(id_usuario);
            delete usuarioActualizado.contrasena;

            // Generar nuevo token JWT
            const payload = {
                id: usuarioActualizado.id_usuario,
                nickname: usuarioActualizado.nickname,
                correo: usuarioActualizado.correo,
                monedas: usuarioActualizado.monedas
            };
            const token = jwt.sign(
                payload,
                config.jwt.secret,
                { expiresIn: '7d' }
            );

            // -------------------------------

            const bodyRespuesta = {
                message: 'Usuario actualizado correctamente',
                token: token,
                usuario: usuarioActualizado
            };

            respuesta.success(req, res, bodyRespuesta, 200);

        } catch (error) {
            console.error('Error completo:', error);
            respuesta.error(req, res, error.message || 'Error actualizando usuario', 500, error);
        }
    }

    async login(req, res) {
        const { correo, contrasena } = req.body;
        let message;
        let statusCode;

        if (!correo || !contrasena) {
            return respuesta.error(req, res, 'Ingrese correo y contraseña', 400);
        }

        try {
            const usuario = await db.loginUsuario(correo);
            const match = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!match) {
                message = 'Contraseña incorrecta';
                throw new Error('Contraseña incorrecta');
            }

            // Generar el token JWT
            const payload = {
                id: usuario.id_usuario,
                nickname: usuario.nickname,
                correo: usuario.correo,
                monedas: usuario.monedas
            };

            const token = jwt.sign(
                payload,
                config.jwt.secret,
                { expiresIn: '7d' }
            );
            // -------------------------------

            delete usuario.contrasena;

            respuesta.success(req, res, { success: true, usuario, token: token }, 200);

        } catch (error) {

            console.error('Error completo en login:', error);
            if (message === '') message = 'Error en el login';
            statusCode = 500;

            if (error.code === 'USER_NOT_FOUND' || error.message === 'Contraseña incorrecta') {
                message = error.message;
                statusCode = 401;
            }

            return respuesta.error(req, res, message, statusCode, error);
        }
    }
}

module.exports = new UsuarioControlador();