const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./usuario');

class UsuarioPersonaje extends Model {}

UsuarioPersonaje.init({
    id_usuario_personaje: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_personaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_compra: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Usuario_Personaje',
    tableName: 'Usuario_Personaje',
    timestamps: false
});

module.exports = { UsuarioPersonaje };