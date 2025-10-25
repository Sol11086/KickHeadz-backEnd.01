const jwt = require('jsonwebtoken');
const config = require('../config');
const respuesta = require('../red/respuestas');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return respuesta.error(req, res, 'Acceso denegado (No hay token)', 401);
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return respuesta.error(req, res, 'Acceso denegado (Token mal formado)', 401);
    }

    try {
        const payloadVerificado = jwt.verify(token, config.jwt.secret);      
        req.user = payloadVerificado;     
        next(); 

    } catch (error) {
        respuesta.error(req, res, 'Token inválido', 401);
    }
}

module.exports = {
    verificarToken
};