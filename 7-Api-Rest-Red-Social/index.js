// Importar dependencias
const { connection } = require("./db/connection");
const express = require("express");
const cors = require("cors");

// Mensaje bienvenida
console.log("Api node para red social arrancada!");

// conexion a bbdd
connection();

// crear servidor node
const app = express();
const puerto = 3900;

// configurar cors
app.use(cors()); // se ejecuta antes de cualquier otra cosa

// convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extend: true }));

// cargar conf rutas
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

// ruta de prueba
app.get("/ruta-prueba", (req, res) => {
  return res.status(200).json({
    id: 1,
    nombre: "Victor",
    web: "victorrobles@web.es",
  });
});

// poner servidor a escuchar peticiones http
app.listen(puerto, () => {
  console.log("Servidor de node corriendo en el puerto", puerto);
});
