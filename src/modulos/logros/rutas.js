const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../../auth/jwt');

router.get('/', auth.verificarToken, controlador.listar);
router.get('/conseguidos', auth.verificarToken, controlador.misLogros);
router.post('/desbloquear', auth.verificarToken, controlador.desbloquear);

module.exports = router;