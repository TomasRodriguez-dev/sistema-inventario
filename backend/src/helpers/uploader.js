const { v4: uuidv4 } = require("uuid");
const path = require("path");

const extensions = ["pdf"];

/**
 * Helper para la carga de archivos
 * @param {Object} files - Objeto de archivos de la solicitud (req.files)
 * @returns {Promise<string>} Nombre del archivo
 */
const uploadFiles = (files) => {
    return new Promise((resolve, reject) => {
        if (!files || !files.recibo) {
            return reject({ msg: 'No se ha proporcionado un archivo de recibo' });
        }

        const file = files.recibo;
        const extensionAndName = file.name.split(".");
        const extension = extensionAndName[extensionAndName.length - 1];

        if (!extensions.includes(extension.toLowerCase())) {
            return reject({ msg: `Extensión permitida: ${extensions.join(', ')}` });
        }

        // Generar nombre de archivo con formato: recibo-YYYY-MM-DD-uuid.pdf
        const now = new Date();
        const dateString = now.toISOString().split('T')[0]; // Esto da el formato YYYY-MM-DD
        const tempName = `recibo-${dateString}-${uuidv4()}.${extension}`;

        const uploadPath = path.join(__dirname, "../uploads/", tempName);

        file.mv(uploadPath, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(tempName);
            }
        });
    });
};

module.exports = { uploadFiles };
