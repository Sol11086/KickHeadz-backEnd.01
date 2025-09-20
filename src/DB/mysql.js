const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function UsuarioList() {
  try {
    const [rows] = await pool.query(`SELECT * FROM Usuario`);
    return rows;
  } catch (error) {
    console.error('Error en la consulta:', error);
    throw error;
  }
}

async function agregarUsuario(nickname, correo, contrasena, fechaNacimiento) {
    try {
        const [rows] = await pool.query(
            'CALL sp_agregar_usuario(?, ?, ?, ?)',
            [nickname, correo, contrasena, fechaNacimiento]
        );
        return rows;
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
}

async function loginUsuario(correo) {
    const [rows] = await pool.query('CALL sp_login_usuario(?)', [correo]);
    const usuario = rows[0][0];
    if (!usuario) throw { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' };
    return usuario;
}


module.exports = {
  UsuarioList,
  agregarUsuario,
  loginUsuario,
};
