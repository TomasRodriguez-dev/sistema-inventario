const express = require('express');
const { check, validationResult } = require('express-validator');
const { registrarPago, obtenerPagosUsuario } = require('../controllers/pagoController');
const auth = require('../middlewares/authMiddlewares');

const router = express.Router();

// Validación de campos
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const simplifiedErrors = errors.array().map(error => ({
            error: error.msg,
            field: error.path
        }));
        return res.status(400).json({ errores: simplifiedErrors, success: false });
    }
    next();
};

/**
 * Ruta para registrar un nuevo pago
 */
router.post('/pago', [
    auth,
    check('idusuario', 'El ID de usuario es obligatorio').isInt(),
    check('monto', 'El monto debe ser un número positivo').isFloat({ min: 0.01 }),
    check('fecha_pago', 'La fecha de pago es obligatoria').isDate(),
    check('idmetodopago', 'El método de pago es obligatorio').isInt(),
    check('idestadopago', 'El estado del pago es obligatorio').isInt(),
    validate
], registrarPago);

/**
 * Ruta para obtener los pagos de usuario(s)
 */
router.get('/pagos', auth, obtenerPagosUsuario);

module.exports = router;
