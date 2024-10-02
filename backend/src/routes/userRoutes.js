const express = require('express');
const { check, validationResult } = require('express-validator');
const { createUser, editUser, deleteUser, getUsers } = require('../controllers/userController');
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
 * Ruta para crear un nuevo usuario
 */
router.post('/pev_usuario', [
    auth,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor, incluya un email válido').isEmail(),
    check('contrasena', 'Por favor, ingrese una contraseña con 6 o más caracteres').isLength({ min: 6 }),
    check('idrol', 'El rol es obligatorio').isInt({ min: 1, max: 3 }),
    validate
], createUser);

/**
 * Ruta para editar un usuario existente
 */
router.put('/pev_usuario/:id', [
    auth,
    check('nombre', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('email', 'Por favor, incluya un email válido').optional().isEmail(),
    check('idrol', 'Rol no válido').optional().isInt({ min: 1, max: 3 }),
    check('estado', 'Estado no válido').optional().isBoolean(),
    validate
], editUser);

/**
 * Ruta para eliminar un usuario
 */
router.delete('/pev_usuario/:id', auth, deleteUser);

/**
 * Ruta para obtener la lista de usuarios
 */
router.get('/pev_usuarios', auth, getUsers);

module.exports = router;