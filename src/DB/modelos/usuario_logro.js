const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./usuario');

class UsuarioLogro extends Model {}

UsuarioLogro.init({
    id_usuario_logro: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_logro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_obtenido: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Usuario_Logro',
    tableName: 'Usuario_Logro',
    timestamps: false
});

module.exports = { UsuarioLogro };