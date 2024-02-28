// Importar modelos
const Album = require("../models/album");

// accion de prueba
const album = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/album.js",
  });
};

const save = async (req, res) => {
  try {
    // Sacar datos enviados en el body
    let params = req.body;

    // Crear objeto
    let album = new Album(params);

    // Guardar objeto
    const albumStored = await album.save();

    if (!albumStored) {
      return res.status(400).send({
        status: "error",
        message: "Error al guardar el album",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Album guardado",
      album: albumStored,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

const one = async (req, res) => {
  try {
    // Sacar el id del album
    const albumId = req.params.id;
    // find y popular info del artist
    const album = await Album.findById(albumId).populate("artist").exec();
    
    if (!album) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el album",
      });
    }
    
    return res.status(200).send({
      status: "success",
      album,
    });
  } catch (error) {
    console.error("Error retrieving album:", error);
    return res.status(500).send({
      status: "error",
      message: "Error retrieving album",
    });
  }
};

module.exports = {
  album,
  save,
  one,
};
