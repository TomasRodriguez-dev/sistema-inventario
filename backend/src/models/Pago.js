const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    id_metodo_pago: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_estado_pago: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_recibo: {
        type: DataTypes.INTEGER,
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
    tableName: 'Pago',
});

module.exports = Pago;