// Importar conexion a base de datos
const connection = require("./database/connection");

// Importar dependencias
const express = require("express");
const cors = require("cors");

// Mensaje de bienvenida
console.log("Api rest con Node para la app musica arrancada!");

// Ejecutar la conexion a la bd
connection();

// Crear srvidor de node
const app = express();
const port = 3910;

// Configurar cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar configuracion de rutas
const UserRoutes = require("./routes/user");
const ArtistRoutes = require("./routes/artist");
const AlbumRoutes = require("./routes/album");
const SongRoutes = require("./routes/song");

app.use("/api/user", UserRoutes);
app.use("/api/artist", ArtistRoutes);
app.use("/api/song", SongRoutes);
app.use("/api/album", AlbumRoutes);

// Ruta de prueba
app.get("/ruta-probando", (req, res) => {
  return res.status(200).send({
    id: 12,
  });
});

// Poner el servidor a escuchar peticiones http
app.listen(port, () => {
  console.log("Servidor de prueba", port);
});
