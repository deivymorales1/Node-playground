// Importar modulos
const fs = require("fs");
const path = require("path");

// Importar modelos
const Publication = require("../models/publication");

// Importar servicios
const followService = require("../services/followService");

// Guardar publicacion
const save = async (req, res) => {
  try {
    // Recoger datos del body
    const params = req.body;

    // Si no llega dar respuesta negativa
    if (!params.text) {
      return res.status(400).send({
        status: "error",
        message: "Debes enviar el texto de la publicación",
      });
    }

    // Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    // Guardar objeto en la base de datos
    const publicationStored = await newPublication.save();

    if (!publicationStored) {
      return res.status(400).send({
        status: "error",
        message: "No se ha guardado la publicación",
      });
    }

    res.status(200).send({
      status: "success",
      message: "Publicación guardada",
      publicationStored,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Error al guardar la publicación",
      error: error.message,
    });
  }
};

// Sacar una publicacion
const detail = async (req, res) => {
  try {
    // Sacar id de publicación de la URL
    const publicationId = req.params.id;

    // Encontrar la publicación por id
    const publicationStored = await Publication.findById(publicationId);

    if (!publicationStored) {
      return res.status(404).send({
        status: "error",
        message: "No existe la publicación",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Mostrar publicación",
      publication: publicationStored,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la publicación",
      error: error.message,
    });
  }
};

// Eliminar publicaciones
const remove = async (req, res) => {
  try {
    // Sacar el id de la publicacion a eliminar
    const publicationId = req.params.id;

    // Find y luego un deleteOne con async/await
    await Publication.deleteOne({ user: req.user.id, _id: publicationId });

    return res.status(200).send({
      status: "success",
      message: "Publicacion eliminada correctamente",
      publication: publicationId,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "No se ha eliminado la publicacion",
    });
  }
};

// Listar publicaciones de un usuario
const user = async (req, res) => {
  try {
    // Sacar el id del usuario
    const userId = req.params.id;

    // Controlar la pagina
    let page = 1;

    if (req.params.page) page = req.params.page;

    const itemsPerPage = 5;

    // Find, populate, ordenar, pagina con async/await y mongoose-paginate-v2
    const { docs, totalDocs } = await Publication.paginate(
      { user: userId },
      {
        page,
        limit: itemsPerPage,
        sort: { created_at: -1 },
        populate: { path: "user", select: "-password -__v -role -email" },
      }
    );

    return res.status(200).send({
      status: "success",
      message: "Publicaciones del perfil de un usuario",
      page,
      total: totalDocs,
      //       pages: Math.ceil(total / itemsPerPage),
      publications: docs,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener las publicaciones del usuario",
    });
  }
};

// Subir ficheros
const upload = async (req, res) => {
  try {
    // Sacar publicacion id
    const publicationId = req.params.id;

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
      return res.status(404).send({
        status: "error",
        message: "Peticion no incluye la imagen",
      });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split(".");
    const extension = imageSplit[1];

    // Comprobar extension
    if (
      extension != "png" &&
      extension != "jpg" &&
      extension != "gif" &&
      extension != "jpeg"
    ) {
      // Borrar archivo subido
      const filePath = req.file.path;
      const fileDeleted = fs.unlinkSync(filePath);

      // Devolver respuesta
      return res.status(400).send({
        status: "error",
        message: "Extension del fichero invalida",
      });
    }

    // Usar async/await para manejar la promesa devuelta por findOneAndUpdate
    const publicationUpdated = await Publication.findOneAndUpdate(
      { user: req.user.id, _id: publicationId },
      { file: req.file.filename },
      { new: true }
    );

    if (!publicationUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida del avatar",
      });
    }

    // Devolver respuesta
    return res.status(200).send({
      status: "success",
      publication: publicationUpdated,
      file: req.file,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Error en la subida del avatar",
    });
  }
};

// Devolver archivos multimedia
const media = (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;
  // Montar el path real de la imagen
  const filePath = "./uploads/publications/" + file;
  // Comprobar que existe
  fs.stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen",
      });
    }
    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  });
  // Devolver un file
};

// Listar todas las publicaciones
const feed = async (req, res) => {
  // Sacar la pagina actual
  let page = 1;

  if (req.params.page) page = req.params.page;

  // Establecer numero de elementos por pagina
  let itemsPerPage = 5;

  // Sacar un array de identificadores de usuarios que yo sigo como usuario logueado
  try {
    const myFollows = await followService.followUserIds(req.user.id);

    // Find a publicaciones in, ordenar, popular, paginar con async/await y mongoose-paginate-v2
    const { docs, totalDocs } = await Publication.paginate(
      { user: { $in: myFollows.following } },
      {
        page,
        limit: itemsPerPage,
        sort: { created_at: -1 },
        populate: { path: "user", select: "-password -role -__v -email" },
      }
    );
    return res.status(200).send({
      status: "success",
      message: "Feed de publicaciones",
      following: myFollows.following,
      total: totalDocs,
      page,
      itemsPerPage,
      pages: Math.ceil(totalDocs / itemsPerPage),
      publications: docs,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener feed de publicaciones",
    });
  }
};

// Exportar acciones
module.exports = {
  save,
  detail,
  remove,
  user,
  upload,
  media,
  feed,
};
