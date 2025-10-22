const express = require('express');
const controlador = require('./controlador'); 

const router = express.Router();

router.get('/', controlador.UsuarioList);
router.post('/registrar', controlador.registrarUsuario);
router.post('/login', controlador.login);

module.exports = router;