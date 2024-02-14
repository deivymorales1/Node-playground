// Importaciones
const bcrypt = require("bcrypt");
const { validate } = require("../helpers/validate");
const User = require("../models/user");

// accion de prueba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde controllers/user.js",
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

module.exports = {
  prueba,
  register,
};
