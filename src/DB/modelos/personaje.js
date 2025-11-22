const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./usuario'); // Usamos la misma conexión de usuario.js

class Personaje extends Model {}

Personaje.init({
    id_personaje: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    estadisticas: {
        type: DataTypes.JSON, // Sequelize maneja JSON nativo perfectamente
        allowNull: true
    },
    aspecto: {
        type: DataTypes.STRING(255), // Aquí iría la skinKey (ej: "Santi") o ruta de imagen
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Personaje',
    tableName: 'Personaje',
    timestamps: false
});

module.exports = { Personaje };