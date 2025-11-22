const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../../auth/jwt');

router.post('/comprar', auth.verificarToken, controlador.comprar);
router.get('/mis-personajes', auth.verificarToken, controlador.misPersonajes);

module.exports = router;