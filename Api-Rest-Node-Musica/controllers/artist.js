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
      artist: artistStored,
    });
  } catch (error) {
    return res.status(200).send({
      status: "error",
      message: "No se ha guardado el artista",
      error: error.message,
    });
  }
};

const one = (req, res) => {
  // Sacar un parametro por la url
  const artistId = req.params.id;

  // Find
  Artist.findById(artistId, (error, artist) => {
    if (error || !artist) {
      return res.status(404).send({
        status: "error",
        message: "No existe el artista",
      });
    }
    return res.status(200).send({
      status: "success",
      artist,
    });
  });
};

module.exports = {
  save,
  one,
};
