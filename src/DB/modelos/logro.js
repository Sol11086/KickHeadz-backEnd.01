const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./usuario');

class Logro extends Model {}

Logro.init({
    id_logro: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    recompensa: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Logro',
    tableName: 'Logro',
    timestamps: false
});

module.exports = { Logro };