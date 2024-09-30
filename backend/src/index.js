const app = require("./app");
const { connectDB, sequelize } = require("./database/database"); 
require('./models/relaciones'); // Asegúrate de importar las relaciones aquí
const crearRolesIniciales = require('./scripts/crearRolesIniciales');

const main = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Sincronizar modelos
        await sequelize.sync(); // Asegúrate de que sequelize no sea undefined
        console.log('Modelos sincronizados con la base de datos');

        // Crear roles iniciales
        await crearRolesIniciales();

        // Iniciar el servidor
        app.listen(app.get("port"), () => {
            console.log(`Server corriendo en el puerto ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Error iniciando el servidor:", error);
        process.exit(1); 
    }
};

main();