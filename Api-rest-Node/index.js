const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("App de node arrancada");

// Conectar a la base de datos
connection();

// Crear servidor de node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json());

// Crear rutas
app.get("/probando", (req, res) => {
  console.log("Probando");
  return res.status(200).json({
    
  })
});

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto ", puerto);
});
