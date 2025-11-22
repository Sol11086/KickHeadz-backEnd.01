const express = require('express');
const cors = require('cors');
const config = require('./config')

const usuarios = require('./modulos/usuarios/rutas')
const partidos = require('./modulos/partidos/rutas');
const tienda = require('./modulos/tienda/rutas');

const app = express();

app.set('port', config.app.port)

app.use(cors()); 
app.use(express.json());
app.use('/api/usuarios',usuarios)
app.use('/api/partidos', partidos);
app.use('/api/tienda', tienda);


module.exports = app;