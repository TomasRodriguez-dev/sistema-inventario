const reciboController = require('../../controllers/reciboController');
const Recibo = require('../../models/Recibo');
const Pago = require('../../models/Pago');
const { uploadFiles } = require('../../helpers/uploader');

// Mockear los módulos necesarios
jest.mock('../../models/Recibo');
jest.mock('../../models/Pago');
jest.mock('../../helpers/uploader');

// Pruebas para el controlador de recibos
describe('reciboController', () => {
    let req, res;

    // Configuración de los mocks
    beforeEach(() => {
        req = {
            body: {},
            user: {},
            files: {},
            protocol: 'http',
            get: jest.fn().mockReturnValue('localhost')
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Pruebas para la subida de recibos
    describe('subirRecibo', () => {
        it('Se tiene que subir un recibo exitosamente', async () => {
            // Configuración de los mocks
            req.body = { idpago: 1 };
            req.user = { idrol: 1 };
            req.files = { recibo: {} };

            Pago.findByPk.mockResolvedValue({ id: 1, update: jest.fn() });
            uploadFiles.mockResolvedValue('archivo.pdf');
            Recibo.create.mockResolvedValue({
                id: 1,
                idpago: 1,
                path_archivo: 'uploads/archivo.pdf',
                fecha_subida: new Date(),
                estado_recibo: 'Subido'
            });

            // Se va a llamar a la función subirRecibo
            await reciboController.subirRecibo(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                recibo: expect.any(Object),
                mensaje: 'Recibo subido exitosamente',
                success: true
            });
        });

        it('Se tiene que devolver un error si el usuario no tiene permisos', async () => {
            // Configuración de los mocks
            req.user = { idrol: 3 };

            // Se va a llamar a la función subirRecibo
            await reciboController.subirRecibo(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'No tienes permisos para subir recibos',
                success: false
            });
        });
    });

    // Pruebas para la obtención de recibos
    describe('obtenerRecibo', () => {
        it('Se tiene que obtener un recibo exitosamente para un administrador', async () => {
            // Configuración de los mocks
            req.params = { id: 1 };
            req.user = { id: 1, idrol: 1 };

            const mockRecibo = {
                id: 1,
                idpago: 1,
                path_archivo: 'uploads/archivo.pdf',
                fecha_subida: new Date(),
                estado_recibo: 'Subido',
                Pago: { idusuario: 2 },
                toJSON: jest.fn().mockReturnThis()
            };
            Recibo.findByPk.mockResolvedValue(mockRecibo);

            // Se va a llamar a la función obtenerRecibo
            await reciboController.obtenerRecibo(req, res);

            // Verificación de la respuesta
            expect(res.json).toHaveBeenCalledWith({
                recibo: expect.objectContaining({
                    id: 1,
                    idpago: 1,
                    path_archivo: 'uploads/archivo.pdf',
                    fecha_subida: expect.any(Date),
                    estado_recibo: 'Subido',
                    descarga_recibo: 'http://localhost/uploads/archivo.pdf'
                }),
                success: true
            });
        });

        it('Se tiene que devolver un error si el usuario no tiene permisos para ver el recibo', async () => {
            // Configuración de los mocks
            req.params = { id: 1 };
            req.user = { id: 3, idrol: 3 };

            const mockRecibo = {
                id: 1,
                Pago: { idusuario: 2 },
                toJSON: jest.fn().mockReturnThis()
            };
            Recibo.findByPk.mockResolvedValue(mockRecibo);

            // Se va a llamar a la función obtenerRecibo
            await reciboController.obtenerRecibo(req, res);

            // Verificación de la respuesta
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'No tienes permisos para ver este recibo',
                success: false
            });
        });
    });
});