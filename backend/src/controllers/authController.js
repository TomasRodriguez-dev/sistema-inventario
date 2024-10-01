const jwt = require('jsonwebtoken');
const Usuario = require('./../models/Usuario');
const Rol = require('./../models/Rol');
const { jwtSecret } = require('../configuration/envs');

/**
 * Registro de un nuevo usuario
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @returns 
 */
exports.register = async (req, res) => {
    const { nombre, email, contrasena } = req.body;

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya está registrado', success: false });
        }

        // Obtener el rol de usuario 
        const rolUsuario = await Rol.findByPk(3);
        if (!rolUsuario) {
            return res.status(500).json({ error: 'Error al asignar rol de usuario', success: false });
        }

        // Crear el usuario común
        const usuario = await Usuario.create({
            nombre,
            email,
            contrasena,
            idrol: rolUsuario.id,
            estado: 'activo'
        });

        // Excluir campos sensibles
        const { contrasena: _, idrol, estado, fecha_creacion, fecha_actualizacion, ...usuarioData } = usuario.dataValues;

        // Generar el token JWT
        const payload = { userId: usuario.id, idrol: usuario.idrol };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        // Enviar la respuesta
        res.status(200).json({ usuario: usuarioData, token, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario', success: false });
    }
};

/**
 * Inicio de sesión de un usuario
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @returns 
 */
exports.login = async (req, res) => {
    const { email, contrasena } = req.body;

    // Verificar si el email o la contraseña están faltando
    if (!email || !contrasena) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos', success: false });
    }

    try {
        // Buscar el usuario por email
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales inválidas', success: false });
        }

        // Verificar la contraseña
        const isMatch = await usuario.validPassword(contrasena);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas', success: false });
        }

        // Generar el token JWT
        const payload = { userId: usuario.id };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        const { contrasena: _, tipo, estado, ultima_conexion, fecha_creacion, fecha_actualizacion, ...usuarioData } = usuario.dataValues;
        res.status(200).json({ usuario: usuarioData, token, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión', success: false });
    }
};