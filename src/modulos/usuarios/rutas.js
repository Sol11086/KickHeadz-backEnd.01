const express = require('express');
const controlador = require('./controlador'); 
const auth = require('../../auth/jwt');

const router = express.Router();

router.get('/', auth.verificarToken, controlador.UsuarioList);

router.post('/registrar', controlador.registrarUsuario);
router.post('/login', controlador.login);

module.exports = router;