const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * Función personalizada para validar el dominio del correo electrónico
 */
const validarDominioEmail = (value) => {
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const dominio = value.split('@')[1];
    if (!dominiosValidos.includes(dominio)) {
        throw new Error('Por favor, utiliza un correo electrónico válido');
    }
    return true;
};

/**
 * Ruta de registro
 */
router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email')
        .isEmail().withMessage('Ingrese un correo válido')
        .custom(validarDominioEmail),
    check('contrasena', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
], register);

/**
 * Ruta de login
 */
router.post('/login', [
    check('email')
        .isEmail().withMessage('Ingrese un correo válido')
        .custom(validarDominioEmail),
    check('contrasena', 'Ingrese su contraseña').exists(),
], login);

module.exports = router;