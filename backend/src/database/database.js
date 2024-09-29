const { Sequelize } = require('sequelize');
const config = require('./../config');

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: false,
});

// Función para conectarse a la base de datos
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa con Sequelize');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

module.exports = { sequelize, connectDB };