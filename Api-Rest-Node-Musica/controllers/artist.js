// Importar modelo
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

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

    // Eliminar los álbumes del artista
    const albumsRemoved = await Album.deleteMany({ artist: artistId });

    // Recoger los IDs de los álbumes eliminados
    const albumIds = albumsRemoved.map((album) => album._id);

    // Eliminar las canciones asociadas a los álbumes eliminados
    const songsRemoved = await Song.deleteMany({ album: { $in: albumIds } });

    // Devolver resultado
    return res.status(200).send({
      status: "success",
      message: "Artista y sus elementos asociados eliminados con éxito",
      artistRemoved,
      albumsRemoved,
      songsRemoved,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar al artista o algunos de sus elementos",
      error: error.message,
    });
  }
};

const upload = async (req, res) => {
  // Configuracion de subida (multer)

  // Recoger artist id
  let artistId = req.params.id;

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
    const artistUpdated = await Artist.findOneAndUpdate(
      {
        _id: artistId,
      },
      { image: req.file.filename },
      { new: true }
    );

    // Return response
    return res.status(200).send({
      status: "success",
      artist: artistUpdated,
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
  const filePath = "./uploads/artists/" + file;
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
  image,
};
