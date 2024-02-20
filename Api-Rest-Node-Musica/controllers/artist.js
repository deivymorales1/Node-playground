// Importaciones
const Artist = require("../models/artist");

// Accion guardar artista
const save = async (req, res) => {
  try {
    // Recoger datos del body
    let params = req.body;

    // Crear el objeto a guardar
    let artist = new Artist(params);

    // Guardarlo
    const artistStored = await artist.save();

    return res.status(200).send({
      status: "success",
      message: "Artista guardado",
      artist: artistStored
    });
  } catch (error) {
    return res.status(200).send({
      status: "error",
      message: "No se ha guardado el artista",
      error: error.message
    });
  }
};



module.exports = {
  save,
};
