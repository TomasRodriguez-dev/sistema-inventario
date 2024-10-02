const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const envs = require("./configuration/envs");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const pagoRoutes = require("./routes/pagoRoutes");
const reciboRoutes = require("./routes/reciboRoutes");
const path = require('path');

//* Express
const app = express();

//* Cors
app.use(cors());

//* Settings
app.set("port", envs.port || 3000); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//* Middlewares
app.use(morgan("dev"));
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 20 * 1024 * 1024 },
}));

//* Rutas
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", pagoRoutes);
app.use("/api", reciboRoutes);

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;