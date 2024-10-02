const Pago = require('../models/Pago');
const Usuario = require('../models/Usuario');

/**
 * @description Registrar un pago
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.registrarPago = async (req, res) => {
    const { idusuario, monto, fecha_pago, idmetodopago, idestadopago } = req.body;
    const creadorRolId = req.user.idrol;

    try {
        // Verificar permisos para registrar un pago
        if (creadorRolId === 3) {
            return res.status(403).json({ error: 'No tienes permisos para registrar pagos', success: false });
        }

        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(idusuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado', success: false });
        }

        // Crear el pago
        const nuevoPago = await Pago.create({
            idusuario,
            monto,
            fecha_pago,
            idmetodopago,
            idestadopago,
            fecha_creacion: new Date()
        });

        // Enviar la respuesta con el pago y un mensaje de éxito
        res.status(201).json({ 
            pago: nuevoPago, 
            mensaje: 'Pago registrado exitosamente',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el pago', success: false });
    }
};

/**
 * @description Obtener los pagos de un usuario
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerPagosUsuario = async (req, res) => {
    const usuarioId = req.user.id;
    const rolId = req.user.idrol;

    try {
        let pagos;
        if (rolId === 1 || rolId === 2) {
            // Administradores y superusuarios pueden ver todos los pagos
            pagos = await Pago.findAll();
        } else {
            // Usuarios comunes solo pueden ver sus propios pagos
            pagos = await Pago.findAll({ where: { idusuario: usuarioId } });
        }

        // Enviar la respuesta con los pagos y un mensaje de éxito
        res.status(200).json({ 
            pagos, 
            mensaje: 'Pagos obtenidos exitosamente',
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los pagos', success: false });
    }
};