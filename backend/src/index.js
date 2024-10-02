const app = require("./app");
const { connectDB, sequelize } = require("./database/database"); 
require('./models/relaciones');
const inicializarDatos = require('./scripts/inicializarDatos');

const main = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Sincronizar modelos
        await sequelize.sync();
        console.log('Modelos sincronizados con la base de datos');

        // Inicializar datos (roles, métodos de pago, estados de pago)
        await inicializarDatos();

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