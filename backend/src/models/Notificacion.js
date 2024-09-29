const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_pago: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fecha_notificacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    tipo_notificacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false,
    tableName: 'Notificacion',
});

module.exports = Notificacion;