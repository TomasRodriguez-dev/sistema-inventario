const express = require('express');
const { check, validationResult } = require('express-validator');
const { subirRecibo, obtenerRecibo } = require('../controllers/reciboController');
const auth = require('../middlewares/authMiddlewares');

const router = express.Router();

// Middleware de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success: false });
    }
    next();
};

// Ruta para subir recibo
router.post('/recibo', [
    auth,
    check('idpago', 'El ID del pago es requerido').notEmpty().isInt(),
    check('recibo').custom((value, { req }) => {
        if (!req.files || !req.files.recibo) {
            throw new Error('Debe subir un archivo de recibo');
        }
        return true;
    }),
    validate
], subirRecibo);

// Ruta para obtener información del recibo y URL de descarga
router.get('/recibo/:id', [
    auth,
    check('id', 'El ID del recibo debe ser un número entero').isInt(),
    validate
], obtenerRecibo);

module.exports = router;
