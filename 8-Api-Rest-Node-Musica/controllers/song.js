const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

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

const upload = async (req, res) => {
  // Configuracion de subida (multer)

  // Recoger album id
  let songId = req.params.id;

  // Recoger fichero de imagen y comprobar si existe
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "La peticion no incluye la imagen",
    });
  }

  // Conseguir el nombre del archivo
  let image = req.file.originalname;

  // Sacar info de la imagen
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  // Comprobar si la extension es valida
  if (extension != "mp3" && extension != "ogg") {
    // borrar archivo
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    // Devolver error
    return res.status(404).send({
      status: "error",
      message: "La extension no es valida",
    });
  }

  try {
    // Si es correcto, guardar la imagen en bbdd
    const songUpdated = await Song.findOneAndUpdate(
      {
        _id: songId,
      },
      { file: req.file.filename },
      { new: true }
    );

    // Return response
    return res.status(200).send({
      status: "success",
      song: songUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la subida",
    });
  }
};

const audio = (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;
  // Montar el path real de la imagen
  const filePath = "./uploads/songs/" + file;
  // Comprobar que existe el fichero
  fs.stat(filePath, (error, exists) => {
    if (error || !exists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen",
      });
    }

    return res.sendFile(path.resolve(filePath));
  });
};

module.exports = {
  save,
  one,
  list,
  update,
  remove,
  upload,
  audio,
};
