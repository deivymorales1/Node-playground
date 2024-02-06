const fs = require("fs");
const path = require("path");
const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helper/validar");

const crear = async (req, res) => {
  try {
    // Recoger parámetros por POST a guardar
    const parametros = req.body;

    // Validar datos
    try {
      validarArticulo(parametros);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        mensaje: "Faltan datos por enviar",
      });
    }

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    // Guardar el artículo en la base de datos
    const articuloGuardado = await articulo.save();

    if (!articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el artículo",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Artículo creado con éxito",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar o los datos no son válidos",
    });
  }
};

//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const listar = async (req, res) => {
  try {
    // Simula un retraso de 5 segundos
    //await delay(5000);

    let query = Articulo.find().sort({ fecha: -1 });
    if (req.params.ultimos) {
      query = query.limit(3);
    }

    const articulos = await query.exec();

    return res.status(200).json({
      status: "success",
      articulos,
      mensaje: "lista de articulos con exito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al obtener la lista de articulos",
    });
  }
};

const uno = async (req, res) => {
  // Recoger un id por la url
  try {
    let id = req.params.id;
    // Buscar el articulo
    let articulo = await Articulo.findById(id);

    // Devolver el resultado
    return res.status(200).json({
      status: "success",
      articulo,
      mensaje: "Artículo encontrado",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar el artículo",
    });
  }
};

const borrar = async (req, res) => {
  try {
    let id = req.params.id;

    let articulo = await Articulo.findOneAndDelete({ _id: id });

    // Devolver el resultado
    return res.status(200).json({
      status: "success",
      articulo,
      mensaje: "Metodo de borrar",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al eliminar el articulo",
    });
  }
};

const editar = async (req, res) => {
  try {
    // Recoger el id del articulo a editar.
    let id = req.params.id;

    let articulo = await Articulo.findById(id);

    // Recoger datos del body
    let parametros = req.body;

    // Validar datos
    try {
      validarArticulo(parametros);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        mensaje: "Faltan datos por enviar",
      });
    }

    // Buscar y actualizar articulo
    let articuloActualizado = await Articulo.findOneAndUpdate(
      { _id: id },
      parametros,
      { new: true }
    );
    // Devolver respuesta
    return res.status(200).json({
      status: "success",
      articulo: articuloActualizado,
      mensaje: "Articulo actualizado con exito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el articulo",
    });
  }
};

const subir = async (req, res) => {
  // Configurar multer
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: "error",
      mensaje: "Peticion invalido",
    });
  }
  // recoger el fichero de imagen subido
  console.log(req.file);
  // Nombre del archivo
  let archivo = req.file.originalname;
  // Extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];
  // Comprobar extension correcta
  if (
    extension != "png" &&
    extension != "jpeg" &&
    extension != "jpg" &&
    extension != "gif"
  ) {
    // Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "archivo invalido",
      });
    });
  } else {
    // Si todo va bien, actualizamos el articulo
    try {
      // Recoger el id del articulo a editar.
      let id = req.params.id;

      let articulo = await Articulo.findById(id);

      // Recoger datos del body
      let parametros = req.body;

      // Buscar y actualizar articulo
      let articuloActualizado = await Articulo.findOneAndUpdate(
        { _id: id },
        { imagen: req.file.filename },
        { new: true }
      );
      // Devolver respuesta
      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        mensaje: "Articulo actualizado con exito",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error al actualizar el articulo",
      });
    }
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica,
      });
    }
  });
};

const buscar = async (req, res) => {
  try {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR
    let articulosEncontrados = await Articulo.find({
      $or: [
        { titulo: { $regex: busqueda, $options: "i" } },
        { contenido: { $regex: busqueda, $options: "i" } },
      ],
    }).sort({ fecha: -1 });

    if (!articulosEncontrados || articulosEncontrados.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos",
      });
    }
    // Devolver resultados
    return res.status(200).json({
      status: "success",
      articulosEncontrados,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar articulos",
    });
  }
};

module.exports = {
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscar,
};
