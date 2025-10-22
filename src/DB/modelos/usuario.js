const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../config'); 

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: 'mysql' 
    }
);

class Usuario extends Model {}

Usuario.init({
    // Definición de atributos    
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nickname: {
        type: DataTypes.STRING(50),
        allowNull: false, 
        unique: true
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    monedas: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ojo: tu BD dice 'DEFAULT 0', no 'NULL'
        defaultValue: 0   // Así le dices a Sequelize cuál es el valor por defecto
    },
    fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaRegistro: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,                // La instancia de conexión
    modelName: 'Usuario',     // El nombre del modelo en singular
    tableName: 'Usuario',     // El nombre exacto de la tabla en la BD
    timestamps: false         // No crea las columnas 'createdAt' y 'updatedAt'
});

module.exports = {
    Usuario,
    sequelize 
};