const Rol = require('../models/Rol');

async function crearRolesIniciales() {
    try {
        const roles = [
            { id: 1, nombre: 'superusuario', descripcion: 'Control total del sistema' },
            { id: 2, nombre: 'admin', descripcion: 'Administración de usuarios y contenido' },
            { id: 3, nombre: 'usuario', descripcion: 'Usuario estándar' }
        ];

        for (const rol of roles) {
            const [rolCreado, creado] = await Rol.findOrCreate({
                where: { id: rol.id },
                defaults: rol
            });

            if (creado) {
                console.log(`Rol ${rol.nombre} creado con éxito`);
            } else {
                console.log(`Rol ${rol.nombre} ya existe`);
            }
        }

        console.log('Verificación de roles iniciales completada');
    } catch (error) {
        console.error('Error al verificar/crear roles iniciales:', error);
    }
}

module.exports = crearRolesIniciales;
