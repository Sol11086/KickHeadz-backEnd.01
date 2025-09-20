const express = require('express');
const cors = require('cors');
const config = require('./config')

const usuarios = require('./modulos/usuarios/rutas')

const app = express();

app.set('port', config.app.port)

app.use(cors()); 
app.use(express.json());
app.use('/api/usuarios',usuarios)

module.exports = app;