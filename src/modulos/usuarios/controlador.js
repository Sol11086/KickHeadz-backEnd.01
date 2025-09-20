const db = require('../../DB/mysql');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const USUARIO = 'Usuario';

function validarContrasena(contrasena) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(contrasena);
}

async function UsuarioList () { 
   try {
        const result = await db.UsuarioList(USUARIO);
        return result;
    } catch (error) {
        throw error;
    }
}

async function registrarUsuario({ nickname, correo, contrasena, fechaNacimiento }) {
    try {
        if (!validarContrasena(contrasena)) {
            throw { code: 'INVALID_PASSWORD', message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.' };
        }

        const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

        const result = await db.agregarUsuario(nickname, correo, hash, fechaNacimiento);
        return result;
    } catch (error) {
        throw error;
    }
}

async function login({ correo, contrasena }) {
    const usuario = await db.loginUsuario(correo);

    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) throw { code: 'INVALID_PASSWORD', message: 'Contraseña incorrecta' };

    delete usuario.contrasena;
    return usuario;
}

module.exports = {
    UsuarioList,
    registrarUsuario,
    login,
}