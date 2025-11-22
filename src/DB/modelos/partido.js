const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./usuario'); 

class Partido extends Model {}

Partido.init({
    id_partido: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario', 
            key: 'id_usuario'
        }
    },
    id_personaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nivel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jugador_2: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    resultado: {
        type: DataTypes.ENUM('Ganado', 'Perdido', 'Empate'),
        allowNull: false
    },
    monedas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fecha_partido: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    goles_favor: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    goles_contra: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    sequelize,
    modelName: 'Partido',
    tableName: 'Partido',
    timestamps: false
});

module.exports = { Partido };