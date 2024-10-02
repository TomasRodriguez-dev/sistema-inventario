const authController = require('../../controllers/authController');
const Usuario = require('../../models/Usuario');
const Rol = require('../../models/Rol');
const jwt = require('jsonwebtoken');

// Mockear los módulos necesarios
jest.mock('../../models/Usuario');
jest.mock('../../models/Rol');
jest.mock('jsonwebtoken');

// Pruebas para el controlador de autenticación
describe('authController', () => {
    let req, res;

    // Configuracion de los mocks
    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Pruebas para el registro de usuarios
    describe('register', () => {
        it('Se tiene que registrar un nuevo usuario exitosamente', async () => {
        // Configuracion de los mocks
        Usuario.findOne.mockResolvedValue(null);
        Rol.findByPk.mockResolvedValue({ id: 3 });
        // Creacion de un nuevo usuario
        Usuario.create.mockResolvedValue({
            dataValues: {
            id: 1,
            nombre: 'Test User',
            email: 'test@example.com',
            contrasena: 'hashedPassword',
            idrol: 3,
            estado: true
            }
        });
        // Creacion de un token
        jwt.sign.mockReturnValue('fakeToken');

        // Configurar el cuerpo de la solicitud
        req.body = {
            nombre: 'Test User',
            email: 'test@example.com',
            contrasena: 'password123'
        };

        // Se va a llamar a la funcion register
        await authController.register(req, res);

        // Verificacion de la respuesta
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            usuario: {
                    id: 1,
                    nombre: 'Test User',
                    email: 'test@example.com'
                },
                token: 'fakeToken',
                success: true
            });
        });
    });

    // Pruebas para el inicio de sesión
    describe('login', () => {
        it('Se tiene que iniciar sesión exitosamente', async () => {
        // Configuracion de los mocks
        const mockUsuario = {
            id: 1,
            email: 'test@example.com',
            validPassword: jest.fn().mockResolvedValue(true),
            dataValues: {
                id: 1,
                nombre: 'Test User',
                email: 'test@example.com',
                contrasena: 'hashedPassword',
                idrol: 3
            }
        };
        // Buscar un usuario
        Usuario.findOne.mockResolvedValue(mockUsuario);
        // Crear un token
        jwt.sign.mockReturnValue('fakeToken');

        // Configurar el cuerpo de la solicitud
        req.body = {
            email: 'test@example.com',
            contrasena: 'password123'
        };

        // Se va a llamar a la funcion login
        await authController.login(req, res);

        // Verificacion de la respuesta
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            usuario: {
                id: 1,
                nombre: 'Test User',
                email: 'test@example.com',
                idrol: 3
            },
            token: 'fakeToken',
            success: true
        });
        });
    });
});
