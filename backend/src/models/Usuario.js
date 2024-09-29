const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const bcrypt = require('bcrypt');
const moment = require('moment'); // Para formatear la fecha

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    ultima_conexion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'Usuario',
    indexes: [
        {
            unique: true,
            fields: ['email'],
        }
    ]
});

// Encriptar contraseña antes de crear un usuario
Usuario.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(user.contrasena, salt);
});

// Método para validar contraseña
Usuario.prototype.validPassword = async function (contrasena) { 
    if (!contrasena || !this.contrasena) {
        throw new Error("Datos de contraseña no válidos");
    }
    return await bcrypt.compare(contrasena, this.contrasena);
};

module.exports = Usuario;