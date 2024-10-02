const { sequelize } = require('./../database/database');
const Usuario = require('./Usuario');
const Pago = require('./Pago');
const Notificacion = require('./Notificacion');
const MetodoPago = require('./MetodoPago');
const EstadoPago = require('./EstadoPago');
const Recibo = require('./Recibo');
const Rol = require('./Rol'); 

// Relación entre Usuario y Rol
Usuario.belongsTo(Rol, { foreignKey: 'idrol', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'idrol' });

// Relación de Usuario consigo mismo (para creado_por)
Usuario.belongsTo(Usuario, { as: 'CreadoPor', foreignKey: 'creado_por' });

// Relación de Usuario con Pago
Usuario.hasMany(Pago, { foreignKey: 'idusuario' });
Pago.belongsTo(Usuario, { foreignKey: 'idusuario' });

// Relación de Usuario con Notificacion
Usuario.hasMany(Notificacion, { foreignKey: 'idusuario' });
Notificacion.belongsTo(Usuario, { foreignKey: 'idusuario' });

// Relación de Pago con Recibo
Pago.hasOne(Recibo, { foreignKey: 'idpago' });
Recibo.belongsTo(Pago, { foreignKey: 'idpago' });

// Relación de Pago con MetodoPago
Pago.belongsTo(MetodoPago, { foreignKey: 'idmetodopago' });
MetodoPago.hasMany(Pago, { foreignKey: 'idmetodopago' });

// Relación de Pago con EstadoPago
Pago.belongsTo(EstadoPago, { foreignKey: 'idestado_pago' });
EstadoPago.hasMany(Pago, { foreignKey: 'idestado_pago' });

// Relación de Notificacion con Pago
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