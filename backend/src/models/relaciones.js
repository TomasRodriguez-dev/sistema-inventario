const { sequelize } = require('./../database/database'); // Asegúrate de que apunte a tu archivo database.js
const Usuario = require('./Usuario');
const Pago = require('./Pago');
const Notificacion = require('./Notificacion');
const MetodoPago = require('./MetodoPago');
const EstadoPago = require('./EstadoPago');
const Recibo = require('./Recibo');
const Rol = require('./Rol'); // Asegúrate de importar el modelo Rol

// Relaciones entre modelos
// Relación entre Usuario y Rol
Usuario.belongsTo(Rol, { foreignKey: 'idrol', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'idrol' });

// Relación de Usuario consigo mismo (para creado_por)
Usuario.belongsTo(Usuario, { as: 'CreadoPor', foreignKey: 'creado_por' });

Usuario.hasMany(Pago, { foreignKey: 'idusuario' });
Pago.belongsTo(Usuario, { foreignKey: 'idusuario' });

Usuario.hasMany(Notificacion, { foreignKey: 'idusuario' });
Notificacion.belongsTo(Usuario, { foreignKey: 'idusuario' });

Pago.hasOne(Recibo, { foreignKey: 'idpago' });
Recibo.belongsTo(Pago, { foreignKey: 'idpago' });

Pago.belongsTo(MetodoPago, { foreignKey: 'idmetodopago' });
MetodoPago.hasMany(Pago, { foreignKey: 'idmetodopago' });

Pago.belongsTo(EstadoPago, { foreignKey: 'idestado_pago' });
EstadoPago.hasMany(Pago, { foreignKey: 'idestado_pago' });

Notificacion.belongsTo(Pago, { foreignKey: 'idpago' });

module.exports = {
    sequelize, 
    Usuario,
    Pago,
    Notificacion,
    MetodoPago,
    EstadoPago,
    Recibo,
    Rol
};