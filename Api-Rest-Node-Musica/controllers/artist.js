// Importar modelo
const Artist = require("../models/artist");

// Dependencias
const mongoosePaginate = require("mongoose-paginate-v2");

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
      page = parseInt(req.params.page); // Convert page to integer
    }

    // Definir un numero de elementos por página
    const itemsPerPage = 5;

    const options = {
      page: page,
      limit: itemsPerPage,
      select: "-password -role -__v",
      sort: { name: 1 }, // Sort by name in ascending order
    };

    // Find, ordenarlo y paginarlo
    const result = await Artist.paginate({}, options);

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No hay artistas",
      });
    }

    return res.status(200).send({
      status: "success",
      page: result.page,
      itemsPerPage: result.limit,
      total: result.totalDocs,
      artists: result.docs,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al buscar los artistas",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    // Recoger el id artista url
    const id = req.params.id;

    // Recoger datos body
    const data = req.body;

    // Buscar y actualizar artista
    const artistUpdated = await Artist.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!artistUpdated) {
      return res.status(404).send({
        status: "error",
        message: "No se ha actualizado el artista",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Artista actualizado con exito",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

// Metodo para borrar artista
const remove = async (req, res) => {
  // Sacar el id del artista de la url
  const artistId = req.params.id;

  try {
    // Hacer consulta para buscar y eliminar el artista
    const artistRemoved = await Artist.findByIdAndDelete(artistId);

    // Remove de albums

    // Remove de songs

    // Devolver resultado
    return res.status(200).send({
      status: "error",
      message: "Artista eliminado",
      artistRemoved,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar al artista o algunos de sus elementos",
      error,
    });
  }
};

module.exports = {
  save,
  one,
  list,
  update,
  remove,
};
