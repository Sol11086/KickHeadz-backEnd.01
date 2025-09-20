const express = require('express');
const respuesta = require('../../red/respuestas')
const controlador = require('./controlador');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user = await controlador.UsuarioList();
        respuesta.success(req, res, user, 200);
    } catch (error) {
        respuesta.error(req, res, 'Error obteniendo usuarios', 500, error);
    }
});

router.post('/registrar', async (req, res) => {
    const { nickname, correo, contrasena, fechaNacimiento } = req.body;

    if (!nickname || !correo || !contrasena || !fechaNacimiento) {
        return res.status(400).json({ error: true, message: 'Faltan datos' });
    }

    try {
        await controlador.registrarUsuario({ nickname, correo, contrasena, fechaNacimiento });
        return res.status(201).json({ success: true, message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error completo:', error); // 🔥 aquí ves todo en la consola de Node
        return res.status(500).json({ 
            error: true, 
            message: 'Error registrando usuario', 
            detalle: error.message || error 
        });
    }
});

router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: true, message: 'Faltan datos' });
    }

    try {
        const usuario = await controlador.login({ correo, contrasena });
        return res.status(200).json({ success: true, usuario });
    } catch (error) {
        console.error('Error completo en login:', error);
        return res.status(500).json({ 
            error: true, 
            message: 'Error en login', 
            detalle: error.message || error 
        });
    }
});

module.exports = router;

