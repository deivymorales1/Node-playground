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

module.exports = {
  song,
  save,
  one,
};
