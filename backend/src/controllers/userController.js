const Usuario = require('../models/Usuario');

/**
 * Crear un nuevo usuario
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {number} req.body.rol_id - ID del rol del usuario
 * @param {Object} req.user - Objeto de usuario autenticado
 * @param {number} req.user.id - ID del usuario autenticado
 * @returns 
 */
exports.createUser = async (req, res) => {
    const { nombre, email, contrasena, rol_id } = req.body;
    const creadorId = req.user.id;
    const creadorRolId = req.user.rol_id;

    try {
        // Verificar permisos
        if (creadorRolId === 3) { 
            return res.status(403).json({ error: 'No tienes permisos para crear usuarios', success: false });
        }

        if (creadorRolId === 2 && rol_id !== 3) { 
            return res.status(403).json({ error: 'Los administradores solo pueden crear usuarios comunes', success: false });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya está registrado', success: false });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            contrasena,
            rol_id: creadorRolId === 1 ? rol_id : 3,
            estado: 'activo',
            creado_por: creadorId
        });

        // Excluir campos sensibles
        const { contrasena: _, ...usuarioData } = nuevoUsuario.dataValues;

        res.status(201).json({ 
            usuario: usuarioData, 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario', success: false });
    }
};

/**
 * Editar un usuario existente
 * @param {Object} req.params - Parámetros de la solicitud
 * @param {number} req.params.id - ID del usuario a editar
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.nombre - Nuevo nombre del usuario
 * @param {string} req.body.email - Nuevo email del usuario
 * @param {string} req.body.rol - Nuevo rol del usuario
 * @param {string} req.body.estado - Nuevo estado del usuario
 * @param {Object} req.user - Objeto de usuario autenticado
 * @param {number} req.user.id - ID del usuario autenticado
 * @param {string} req.user.rol - Rol del usuario autenticado
 * @returns 
 */
exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol, estado } = req.body;
    const editorRol = req.user.rol;

    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado', success: false });
        }

        // Verificar permisos
        if (editorRol === 'usuario') {
            return res.status(403).json({ error: 'No tienes permisos para editar usuarios', success: false });
        }

        if (editorRol === 'admin' && (usuario.rol !== 'usuario' || rol !== 'usuario')) {
            return res.status(403).json({ error: 'Los administradores solo pueden editar usuarios comunes', success: false });
        }

        // Actualizar usuario
        await usuario.update({
            nombre: nombre || usuario.nombre,
            email: email || usuario.email,
            rol: editorRol === 'superadmin' ? (rol || usuario.rol) : usuario.rol,
            estado: estado || usuario.estado,
            fecha_actualizacion: new Date()
        });

        // Excluir campos sensibles
        const { contrasena: _, ...usuarioData } = usuario.dataValues;

        res.status(200).json({ 
            usuario: usuarioData, 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar el usuario', success: false });
    }
};

/**
 * Eliminar un usuario existente
 * @param {Object} req.params - Parámetros de la solicitud
 * @param {number} req.params.id - ID del usuario a eliminar
 * @param {Object} req.user - Objeto de usuario autenticado
 * @param {number} req.user.id - ID del usuario autenticado
 * @param {string} req.user.rol - Rol del usuario autenticado
 * @returns 
 */
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const eliminadorRol = req.user.rol;

    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado', success: false });
        }

        // Verificar permisos 
        if (eliminadorRol === 'usuario') {
            return res.status(403).json({ error: 'No tienes permisos para eliminar usuarios', success: false });
        }

        if (eliminadorRol === 'admin' && usuario.rol !== 'usuario') {
            return res.status(403).json({ error: 'Los administradores solo pueden eliminar usuarios comunes', success: false });
        }

        // Eliminar usuario
        await usuario.destroy();

        res.status(200).json({ 
            message: 'Usuario eliminado con éxito', 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario', success: false });
    }
};

/**
 * Obtener la lista de usuarios
 * @param {Object} req.user - Objeto de usuario autenticado
 * @param {number} req.user.id - ID del usuario autenticado
 * @param {number} req.user.rol_id - ID del rol del usuario autenticado
 * @returns 
 */
exports.getUsers = async (req, res) => {
    const solicitanteRolId = req.user.rol_id;

    try {
        let usuarios;
        // Si el usuario es superadmin, puede ver todos los usuarios
        if (solicitanteRolId === 1) { 
            usuarios = await Usuario.findAll({
                attributes: { exclude: ['contrasena'] }
            });
        } else if (solicitanteRolId === 2) { 
            // Si el usuario es admin, puede ver solo los usuarios comunes
            usuarios = await Usuario.findAll({
                where: { rol_id: 3 }, 
                attributes: { exclude: ['contrasena'] }
            });
        } else {
            return res.status(403).json({ error: 'No tienes permisos para ver la lista de usuarios', success: false });
        }

        res.status(200).json({ 
            usuarios, 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de usuarios', success: false });
    }
};
