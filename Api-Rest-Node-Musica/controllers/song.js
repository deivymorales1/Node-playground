const Song = require("../models/song");

// accion de prueba
const song = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/song.js",
  });
};

const save = async (req, res) => {
  try {
    // Recoger datos que me llegan
    let params = req.body;

    // Crear un objeto con mi modelo
    let song = new Song(params);

    let songStored = await song.save();

    if (!songStored) {
      return res.status(500).send({
        status: "error",
        message: "La cancion no se ha guardado",
      });
    }

    return res.status(200).send({
      status: "success",
      song: songStored,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error  al guardar la cancion",
    });
  }
};

const one = async (req, res) => {
  try {
    // Recoger un parametro de la URL
    let songId = req.params.id;

    // Consultar la base de datos
    const song = await Song.findById(songId).populate("album").exec();

    if (!song) {
      return res.status(404).send({
        status: "error",
        message: "La cancion no existe",
      });
    }

    return res.status(200).send({
      status: "success",
      song,
    });
  } catch (error) {
    console.error("Error al obtener la canción:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la canción",
    });
  }
};

const list = async (req, res) => {
  try {
    let albumId = req.params.albumId;

    const songs = await Song.find({ album: albumId })
      .populate({
        path: "album",
        populate: {
          path: "artist",
          model: "Artist",
        },
      })
      .sort("track")
      .exec();

    if (!songs || songs.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No hay canciones",
      });
    }

    return res.status(200).send({
      status: "success",
      songs,
    });
  } catch (error) {
    console.error("Error al listar las canciones:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al listar las canciones",
    });
  }
};

const update = async (req, res) => {
  try {
    // Parametro url id de cancion
    let songId = req.params.id;

    let data = req.body;

    const songUpdated = await Song.findByIdAndUpdate(songId, data, {
      new: true,
    }).exec();

    if (!songUpdated) {
      return res.status(500).send({
        status: "error",
        message: "La cancion no se ha actualizado",
      });
    }

    return res.status(200).send({
      status: "success",
      song: songUpdated,
    });
  } catch (error) {
    console.error("Error al actualizar la cancion:", error);
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar la cancion",
    });
  }
};

const remove = async (req, res) => {
  try {
    // Parametro del id de la cancion
    let songId = req.params.id;

    const songRemoved = await Song.findByIdAndDelete(songId).exec();

    if (!songRemoved) {
      return res.status(500).send({
        status: "error",
        message: "La cancion no se ha borrado",
      });
    }

    return res.status(200).send({
      status: "success",
      song: songRemoved,
    });
  } catch (error) {
    console.error("Error al borrar la cancion: ", error);
    return res.status(500).send({
      status: "error",
      message: "Error al borrar la cancion",
    });
  }
};

module.exports = {
  song,
  save,
  one,
  list,
  update,
  remove,
};
