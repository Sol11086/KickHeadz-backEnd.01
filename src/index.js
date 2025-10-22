require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./DB/modelos/usuario');

async function main() {
    try {

        await sequelize.authenticate();
        console.log('Conexión a la BD establecida correctamente.');
        
        // Usa { force: true } para borrar y recrear (¡CUIDADO!)
        // Usa { alter: true } para intentar modificar tablas existentes.
        await sequelize.sync({ alter: true }); // 'alter' es más seguro que 'force'
        console.log('Modelos sincronizados con la Base de Datos.');

        // Encendemos el servidor
        app.listen(app.get('port'), () => {
            console.log("Servidor escuchando en el puerto", app.get("port"));
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

main();