const express = require('express');
const controlador = require('./controlador');
const auth = require('../../auth/jwt'); // Ajusta la ruta si está en otro lado

const router = express.Router();

router.post('/', auth.verificarToken, controlador.guardarPartido);
router.get('/', auth.verificarToken, controlador.obtenerHistorial);

module.exports = router;