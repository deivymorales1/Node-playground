// Importaciones
const bcrypt = require("bcrypt");
const { validate } = require("../helpers/validate");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const jwt = require("../helpers/jwt");
const { error } = require("console");

// accion de prueba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/user.js",
    user: req.user,
  });
};

// Registro
const register = async (req, res) => {
  try {
    // Recoger datos de la peticion
    let params = req.body;
    console.log(params);

    // Comprobar que me llegan bien
    if (!params.name || !params.nick || !params.email || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    // Validar los datos
    validate(params);

    // Control usuarios duplicados
    const existingUsers = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUsers && existingUsers.length >= 1) {
      return res.status(200).send({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    // Cifrar contrasenia
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // Crear objeto del usuario
    let userToSave = new User(params);

    // Guardar usuario en la bbdd
    const userStored = await userToSave.save();

    // Limpiar el objeto a devolver
    let userCreated = userStored.toObject();
    delete userCreated.password;
    delete userCreated.role;

    // Devolver un resultado
    return res.status(200).send({
      status: "success",
      message: "usuario registrado correctamente",
      user: userCreated,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al registrar usuario",
      error: error,
    });
  }
};

const login = async (req, res) => {
  // Recoger los parametros de la peticion
  let params = req.body;

  // Comprobar que me llegan
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  try {
    // Buscar en la bbdd si existe el mail
    let user = await User.findOne({ email: params.email }).select(
      "+password +role"
    );

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "No existe el usuario",
      });
    }

    // Comprobar su contrasena
    const pwd = bcrypt.compareSync(params.password, user.password);
    if (!pwd) {
      return res.status(400).send({
        status: "error",
        message: "Login incorrecto",
      });
    }

    // Limpiar objetos
    let identityUser = user.toObject();
    delete identityUser.password;
    delete identityUser.role;

    // Conseguir token jwt
    const token = jwt.createToken(user);

    // Devolver datos usuario y token
    return res.status(200).send({
      status: "success",
      message: "Metodo de login",
      user: identityUser,
      token,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

const profile = async (req, res) => {
  try {
    // Recoger id usuario url
    const id = req.params.id;

    // Consulta para sacar los datos del perfil
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe",
      });
    }

    // Devolver resultado
    return res.status(200).send({
      status: "success",
      id,
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

const update = async (req, res) => {
  try {
    // Recoger datos usuario
    let userIdentity = req.user;

    // Recoger datos a actualizar
    let userToUpdate = req.body;

    // Validate user input
    validate(userToUpdate);

    // Check if the user exists
    const users = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() },
      ],
    });

    // Check if the user exist and is not the currently authenticated user
    let userIsset = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) {
        userIsset = true;
      }
    });

    // If  the user already exists, return a response
    if (userIsset) {
      return res.status(200).send({
        status: "success",
        message: "El usuario ya existe",
      });
    }

    // Encrypt password if provided
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    } else {
      delete userToUpdate.password;
    }

    // Find the user in the database and update their data
    let userUpdated = await User.findByIdAndUpdate(
      userIdentity.id,
      userToUpdate,
      { new: true }
    );

    if (!userUpdated) {
      return res.status(400).send({
        status: "error",
        message: "Error al actualizar",
      });
    }

    // Return response
    return res.status(200).send({
      status: "success",
      user: userUpdated,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar",
    });
  }
};

const upload = async (req, res) => {
  // Configuracion de subida (multer)

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
    const userUpdated = await User.findOneAndUpdate(
      {
        _id: req.user.id,
      },
      { image: req.file.filename },
      { new: true }
    );

    // Return response
    return res.status(200).send({
      status: "success",
      user: userUpdated,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la subida",
    });
  }
};

const avatar = (req, res) => {
  // Sacar el parametro de la url
  const file = req.params.file;
  // Montar el path real de la imagen
  const filePath = "./uploads/avatars/" + file;
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
  prueba,
  register,
  login,
  profile,
  update,
  upload,
  avatar,
};
