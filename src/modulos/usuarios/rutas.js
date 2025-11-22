const express = require('express');
const controlador = require('./controlador'); 
const auth = require('../../auth/jwt');

const router = express.Router();

router.get('/', auth.verificarToken, controlador.UsuarioList);
router.put('/actualizar', auth.verificarToken, controlador.actualizarUsuario);
router.post('/recompensa', auth.verificarToken, controlador.recompensa);

router.post('/registrar', controlador.registrarUsuario);
router.post('/login', controlador.login);

module.exports = router;