const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');
const respuesta = require('../../red/respuestas'); 

const SALT_ROUNDS = 10;
const USUARIO = 'Usuario';

class UsuarioControlador {

    constructor() {
        // Asignación de métodos para mantener el contexto 'this'
        this.UsuarioList = this.UsuarioList.bind(this);
        this.registrarUsuario = this.registrarUsuario.bind(this);
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

    async login(req, res) {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return respuesta.error(req, res, 'Faltan datos', 400);
        }

        try {
            const usuario = await db.loginUsuario(correo); 
            const match = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!match) {
                throw new Error('Contraseña incorrecta');
            }

            delete usuario.contrasena;
            
            respuesta.success(req, res, { success: true, usuario }, 200);

        } catch (error) {

            console.error('Error completo en login:', error);
            let mensajeError = 'Error en login';
            let statusCode = 500;

            if (error.code === 'USER_NOT_FOUND' || error.message === 'Contraseña incorrecta') {
                mensajeError = error.message;
                statusCode = 401;
            }

            return respuesta.error(req, res, mensajeError, statusCode, error);
        }
    }
}

module.exports = new UsuarioControlador();