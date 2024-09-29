const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const envs = require("./configuration/envs");
const authRoutes = require("./routes/authRoutes"); 

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

//* Rutas
app.use("/api/auth", authRoutes); 

module.exports = app;