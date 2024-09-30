const express = require('express');
const { check } = require('express-validator');
const { createUser, editUser, deleteUser, getUsers } = require('../controllers/userController');
const auth = require('../middlewares/authMiddlewares');

const router = express.Router();

/**
 * Ruta para crear un nuevo usuario
 */
router.post('/pev_usuario', [
    auth,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('contrasena', 'Por favor, ingresa una contraseña con 6 o más caracteres').isLength({ min: 6 }),
    check('rol', 'El rol es obligatorio').isIn(['superadmin', 'admin', 'usuario'])
], createUser);

/**
 * Ruta para editar un usuario existente
 */
router.put('/pev_usuario/:id', [
    auth,
    check('nombre', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('email', 'Por favor, incluye un email válido').optional().isEmail(),
    check('rol', 'Rol no válido').optional().isIn(['superadmin', 'admin', 'usuario']),
    check('estado', 'Estado no válido').optional().isIn(['activo', 'inactivo'])
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