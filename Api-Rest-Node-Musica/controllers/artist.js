// Importaciones
const Artist = require("../models/artist");

// accion de prueba
const artist = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/artist.js",
  });
};

// Accion guardar artista

module.exports = {
  artist,
};
