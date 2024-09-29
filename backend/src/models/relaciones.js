const { sequelize } = require('./../database/database'); // Asegúrate de que apunte a tu archivo database.js
const Usuario = require('./Usuario');
const Pago = require('./Pago');
const Notificacion = require('./Notificacion');
const MetodoPago = require('./MetodoPago');
const EstadoPago = require('./EstadoPago');
const Recibo = require('./Recibo');

// Relaciones entre modelos
Usuario.hasMany(Pago, { foreignKey: 'id_usuario' });
Pago.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Pago.hasOne(Recibo, { foreignKey: 'id_pago' });
Recibo.belongsTo(Pago, { foreignKey: 'id_pago' });

Pago.belongsTo(MetodoPago, { foreignKey: 'id_metodo_pago' });
MetodoPago.hasMany(Pago, { foreignKey: 'id_metodo_pago' });

Pago.belongsTo(EstadoPago, { foreignKey: 'id_estado_pago' });
EstadoPago.hasMany(Pago, { foreignKey: 'id_estado_pago' });

Notificacion.belongsTo(Pago, { foreignKey: 'id_pago' });

module.exports = {
    sequelize, 
    Usuario,
    Pago,
    Notificacion,
    MetodoPago,
    EstadoPago,
    Recibo
};