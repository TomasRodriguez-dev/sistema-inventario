const jwt = require('jsonwebtoken');
const Usuario = require('./../models/Usuario');

// Controlador de registro
exports.register = async (req, res) => {
    const { nombre, email, contrasena } = req.body;

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya está registrado', success: false });
        }

        // Crear el usuario, la fecha_creacion se almacena automáticamente
        const usuario = await Usuario.create({
            nombre,
            email,
            contrasena
        });

        // Excluir campos no deseados
        const { contrasena: _, tipo, estado, fecha_creacion, fecha_actualizacion, ...usuarioData } = usuario.dataValues;

        // Generar el token JWT
        const secretKey = 'TEST';
        const payload = { userId: usuario.id };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Enviar la respuesta sin la fecha_creacion
        res.status(200).json({ usuario: usuarioData, token, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario', success: false });
    }
};

// Controlador de login
exports.login = async (req, res) => {
    const { email, contrasena } = req.body;

    // Check if email or password is missing
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
        const secretKey = 'TEST';
        const payload = { userId: usuario.id };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        const { contrasena: _, tipo, estado, ultima_conexion, fecha_creacion, fecha_actualizacion, ...usuarioData } = usuario.dataValues;
        res.status(200).json({ usuario: usuarioData, token, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión', success: false });
    }
};