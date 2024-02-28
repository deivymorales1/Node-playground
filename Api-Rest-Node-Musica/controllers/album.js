// Importar modelos
const Album = require("../models/album");
const fs = require("fs");
const path = require("path");

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

const list = async (req, res) => {
  try {
    // Sacar el id del artista de la URL
    const artistId = req.params.artistId;

    // Verificar si se proporcionó un ID de artista
    if (!artistId) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el artista",
      });
    }

    // Buscar todos los álbumes de un artista en particular
    const albums = await Album.find({ artist: artistId })
      .populate("artist")
      .exec();

    // Verificar si se encontraron albumes
    if (!albums || albums.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el artista",
      });
    }

    // Enviar la respuesta con los albumes encontrados
    return res.status(200).send({
      status: "success",
      albums,
    });
  } catch (error) {
    console.log("Error retrieveing  albums:", error);
    return res.status(500).send({
      status: "error",
      message: "Error retrieving albums",
    });
  }
};

const update = async (req, res) => {
  try {
    // Recoger un param URL
    const albumId = req.params.albumId;
    // Recoger el body
    const data = req.body;

    // Find y un update
    const albumUpdated = await Album.findByIdAndUpdate(albumId, data, {
      new: true,
    });

    // Verificar si se actulizo el album
    if (!albumUpdated) {
      return res.status(500).send({
        status: "error",
        message: "No se ha actualizado el album",
      });
    }

    // Enviar la respuesta con el album actualizado
    return res.status(200).send({
      status: "success",
      album: albumUpdated,
    });
  } catch (error) {
    console.error("Error updating album:", error);
    return res.status(500).send({
      status: "error",
      message: "Error updating album",
    });
  }
};

const upload = async (req, res) => {
  // Configuracion de subida (multer)

  // Recoger album id
  let albumId = req.params.id;

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
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gpej"
  ) {
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
    const albumUpdated = await Album.findOneAndUpdate(
      {
        _id: albumId,
      },
      { image: req.file.filename },
      { new: true }
    );

    // Return response
    return res.status(200).send({
      status: "success",
      album: albumUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la subida",
    });
  }
};

const image = (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;
  // Montar el path real de la imagen
  const filePath = "./uploads/albums/" + file;
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

// Borrar album


module.exports = {
  album,
  save,
  one,
  list,
  update,
  upload,
  image,
};
