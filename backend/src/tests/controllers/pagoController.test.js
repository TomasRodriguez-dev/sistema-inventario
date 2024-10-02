const pagoController = require('../../controllers/pagoController');
const Pago = require('../../models/Pago');
const Usuario = require('../../models/Usuario');

// Mockear los módulos necesarios
jest.mock('../../models/Pago');
jest.mock('../../models/Usuario');

// Pruebas para el controlador de pagos
describe('pagoController', () => {
    let req, res;

    // Configuración de los mocks
    beforeEach(() => {
        req = {
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Pruebas para el registro de pagos
    describe('registrarPago', () => {
        it('Se tiene que registrar un pago exitosamente', async () => {
            // Configuración de los mocks
            req.body = {
                idusuario: 1,
                monto: 100,
                fecha_pago: '2023-05-01',
                idmetodopago: 1,
                idestadopago: 1
            };
            req.user = { idrol: 1 };

            Usuario.findByPk.mockResolvedValue({ id: 1 });
            Pago.create.mockResolvedValue({
                id: 1,
                idusuario: 1,
                monto: 100,
                fecha_pago: '2023-05-01',
                idmetodopago: 1,
                idestadopago: 1,
                fecha_creacion: new Date()
            });

            // Se va a llamar a la función registrarPago
            await pagoController.registrarPago(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                pago: expect.any(Object),
                mensaje: 'Pago registrado exitosamente',
                success: true
            });
        });

        it('Se tiene que devolver un error si el usuario no tiene permisos', async () => {
            // Configuración de los mocks
            req.user = { idrol: 3 };

            // Se va a llamar a la función registrarPago
            await pagoController.registrarPago(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'No tienes permisos para registrar pagos',
                success: false
            });
        });
    });

    // Pruebas para la obtención de pagos de usuario
    describe('obtenerPagosUsuario', () => {
        it('Se tiene que obtener todos los pagos para un administrador', async () => {
            // Configuración de los mocks
            req.user = { id: 1, idrol: 1 };
            const mockPagos = [
                { id: 1, idusuario: 1, monto: 100 },
                { id: 2, idusuario: 2, monto: 200 }
            ];
            Pago.findAll.mockResolvedValue(mockPagos);

            // Se va a llamar a la función obtenerPagosUsuario
            await pagoController.obtenerPagosUsuario(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                pagos: mockPagos,
                mensaje: 'Pagos obtenidos exitosamente',
                success: true
            });
        });

        it('Se tiene que obtener solo los pagos del usuario para un usuario común', async () => {
            // Configuración de los mocks
            req.user = { id: 3, idrol: 3 };
            const mockPagos = [
                { id: 3, idusuario: 3, monto: 300 }
            ];
            Pago.findAll.mockResolvedValue(mockPagos);

            // Se va a llamar a la función obtenerPagosUsuario
            await pagoController.obtenerPagosUsuario(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                pagos: mockPagos,
                mensaje: 'Pagos obtenidos exitosamente',
                success: true
            });
        });
    });
});
