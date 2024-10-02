const userController = require('../../controllers/userController');
const Usuario = require('../../models/Usuario');

// Mockear el modelo Usuario
jest.mock('../../models/Usuario');

// Pruebas para el controlador de usuarios
describe('userController', () => {
    let req, res;

    // Configuracion de los mocks
    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Pruebas para la creacion de usuarios
    describe('createUser', () => {
        it('Se tiene que crear un nuevo usuario exitosamente', async () => {
            // Configuracion de los mocks
            req.body = {
                nombre: 'Nuevo Usuario',
                email: 'nuevo@example.com',
                contrasena: 'password123',
                idrol: 3
            };
            // Creacion de un superadmin
            req.user = { id: 1, idrol: 1 };
            Usuario.findOne.mockResolvedValue(null);
            Usuario.create.mockResolvedValue({
                dataValues: {
                    id: 2,
                    nombre: 'Nuevo Usuario',
                    email: 'nuevo@example.com',
                    idrol: 3,
                    estado: true,
                    creado_por: 1
                }
            });
            await userController.createUser(req, res);

            // Verificacion de la creacion de un usuario
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                usuario: {
                    id: 2,
                    nombre: 'Nuevo Usuario',
                    email: 'nuevo@example.com',
                    idrol: 3,
                    estado: true,
                    creado_por: 1
                },
                success: true
            });
        });
    });

    // Pruebas para la edicion de usuarios
    describe('editUser', () => {
        it('Se tiene que editar un usuario exitosamente', async () => {
            // Configuracion de los mocks
            req.params = { id: 2 };
            // Edicion de un usuario
            req.body = {
                nombre: 'Usuario Actualizado',
                email: 'actualizado@example.com'
            };
            req.user = { id: 1, idrol: 1 };
            // Creacion de un usuario original
            const mockUsuario = {
                id: 2,
                nombre: 'Usuario Original',
                email: 'original@example.com',
                idrol: 3,
                update: jest.fn().mockResolvedValue(true),
                dataValues: {
                    id: 2,
                    nombre: 'Usuario Actualizado',
                    email: 'actualizado@example.com',
                    idrol: 3
                }
            };
            // Edicion de un usuario
            Usuario.findByPk.mockResolvedValue(mockUsuario);
            await userController.editUser(req, res);

            // Verificacion de la edicion de un usuario
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                usuario: {
                    id: 2,
                    nombre: 'Usuario Actualizado',
                    email: 'actualizado@example.com',
                    idrol: 3
                },
                success: true
            });
        });
    });

    // Pruebas para la eliminacion de usuarios
    describe('deleteUser', () => {
        it('Se tiene que eliminar un usuario exitosamente', async () => {
            // Configuracion de los mocks
            req.params = { id: 2 };
            req.user = { id: 1, idrol: 1 };
            // Creacion de un usuario
            const mockUsuario = {
                id: 2,
                idrol: 3,
                destroy: jest.fn().mockResolvedValue(true)
            };
            // Eliminacion de un usuario
            Usuario.findByPk.mockResolvedValue(mockUsuario);
            await userController.deleteUser(req, res);

            // Verificacion de la eliminacion de un usuario
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Usuario eliminado con éxito',
                success: true
            });
        });
    });

    // Pruebas para la obtencion de usuarios
    describe('getUsers', () => {
        // Pruebas para la obtencion de usuarios ya sean admin o comunes para un superadmin
        it('Se tiene que obtener todos los usuarios para un superadmin', async () => {
            // Configuracion de los mocks
            req.user = { id: 1, idrol: 1 };
            // Creacion de usuarios
            const mockUsuarios = [
                { id: 1, nombre: 'Admin', email: 'admin@example.com', idrol: 1 },
                { id: 2, nombre: 'Usuario', email: 'usuario@example.com', idrol: 3 }
            ];
            // Obtencion de usuarios
            Usuario.findAll.mockResolvedValue(mockUsuarios);
            await userController.getUsers(req, res);

            // Verificacion de la obtencion de usuarios
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                usuarios: 
                    mockUsuarios,
                    success: true
                });
        });
        // Pruebas para la obtencion de usuarios comunes para un admin
        it('Se tiene que obtener solo usuarios comunes para un admin', async () => {
            // Configuracion de los mocks
            req.user = { id: 2, idrol: 2 };
            // Creacion de un usuario
            const mockUsuarios = [
                { id: 2, nombre: 'Usuario', email: 'usuario@example.com', idrol: 3 }
            ];
            // Obtencion de un usuario
            Usuario.findAll.mockResolvedValue(mockUsuarios);
            await userController.getUsers(req, res);

            // Verificacion de la obtencion de un usuario
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                usuarios: mockUsuarios,
                success: true
            });
        });
    });
});