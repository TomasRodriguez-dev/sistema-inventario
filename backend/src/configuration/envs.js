const config = require("dotenv");
const joi = require("joi");

config.config();

/**
 * Esquema de validación de variables de entorno
 */
const envsSchema = joi
    .object({
        PORT: joi.number().required(),
        JWT_SECRET: joi.string().required(),
    })
    .unknown(true);

/**
 * Validar las variables de entorno
 */
const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars = value;

const envs = {
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
};

module.exports = envs;