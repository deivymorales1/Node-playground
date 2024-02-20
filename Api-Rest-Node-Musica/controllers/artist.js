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

const one = async (req, res) => {
  try {
    // Sacar un parametro por la url
    const artistId = req.params.id;

    // Find
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).send({
        status: "error",
        message: "No existe el artista",
      });
    }

    return res.status(200).send({
      status: "success",
      artist,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar el artista",
      error: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    // Sacar la posible pagina
    let page = 1;

    if (req.params.page) {
      page = req.params.page;
    }

    // Definir un numero de elementos por página
    const itemsPerPage = 5;

    // Find, ordenarlo y paginarlo
    const artists = await Artist.find().sort("name").exec();

    return res.status(200).send({
      status: "success",
      artists,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar los artistas",
      error: error.message,
    });
  }
};

module.exports = {
  save,
  one,
  list,
};
