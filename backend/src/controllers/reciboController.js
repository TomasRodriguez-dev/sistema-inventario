const path = require('path');
const Recibo = require('../models/Recibo');
const Pago = require('../models/Pago');
const { uploadFiles } = require('../helpers/uploader');

/**
 * @description Subir un recibo
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto de respuesta con el recibo y un mensaje de éxito
 */
exports.subirRecibo = async (req, res) => {
    const { idpago } = req.body;
    const creadorRolId = req.user.idrol;

    try {
        // Verificar permisos para subir un recibo
        if (creadorRolId === 3) {
            return res.status(403).json({ error: 'No tienes permisos para subir recibos', success: false });
        }

        // Verificar si se subió un archivo
        if (!req.files || !req.files.recibo) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo de recibo', success: false });
        }

        // Verificar si el pago existe
        const pago = await Pago.findByPk(idpago);
        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado', success: false });
        }

        // Subir el archivo de recibo
        let fileName;
        try {
            fileName = await uploadFiles(req.files);
        } catch (uploadError) {
            return res.status(400).json({ error: 'Error al subir el archivo', detalles: uploadError.msg, success: false });
        }

        // Guardar ruta relativa usando path.posix.join para asegurar forward slashes
        const relativePath = path.posix.join('uploads', fileName);

        // Crear el recibo
        const nuevoRecibo = await Recibo.create({
            idpago,
            path_archivo: relativePath,
            fecha_subida: new Date(),
            estado_recibo: 'Subido'
        });

        // Actualizar el pago con el id del recibo
        await pago.update({ idrecibo: nuevoRecibo.id });

        // Enviar la respuesta con el recibo y un mensaje de éxito
        res.status(201).json({ 
            recibo: nuevoRecibo,
            mensaje: 'Recibo subido exitosamente', 
            success: true
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación', 
                details: error.errors.map(e => e.message),
                success: false 
            });
        }
        res.status(500).json({ error: 'Error interno del servidor al subir el recibo', success: false });
    }
};

/** 
 * @description Obtener un recibo
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto de respuesta con el recibo y un mensaje de éxito
 */
exports.obtenerRecibo = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const rolId = req.user.idrol;

    try {
        // Verificar si el recibo existe
        const recibo = await Recibo.findByPk(id, {
            attributes: ['id', 'idpago', 'path_archivo', 'fecha_subida', 'estado_recibo'],
            include: [{
                model: Pago,
                attributes: ['idusuario'],
            }]
        });
        if (!recibo) {
            return res.status(404).json({ error: 'Recibo no encontrado', success: false });
        }

        // Verificar permisos para ver el recibo
        if (rolId === 3 && recibo.Pago.idusuario !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permisos para ver este recibo', success: false });
        }

        // Construir la URL de descarga para poder ver el recibo y descargar
        const descarga_recibo = `${req.protocol}://${req.get('host')}/${recibo.path_archivo}`;

        // Eliminar la información del pago de la respuesta
        const { Pago: pagoInfo, ...reciboSinPago } = recibo.toJSON();

        // Enviar la respuesta con el recibo y la URL de descarga
        res.json({ 
            recibo: {
                ...reciboSinPago,
                descarga_recibo
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el recibo', success: false });
    }
};