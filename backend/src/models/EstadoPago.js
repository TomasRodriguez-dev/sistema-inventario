const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const EstadoPago = sequelize.define('EstadoPago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'EstadoPago',
});

module.exports = EstadoPago;